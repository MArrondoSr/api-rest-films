import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { adminDb } from '../data/admin.js';

const secret_key = process.env.JWT_SECRET_KEY;

export const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Formato de token inválido'
        });
    }

    jwt.verify(token, secret_key, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Token inválido o vencido'
            });
        }

        try {
            const userDoc = await adminDb
                .collection('users')
                .doc(decoded.id)
                .get();

            if (!userDoc.exists) {
                return res.status(403).json({
                    message: 'Perfil de usuario no encontrado'
                });
            }

            const userProfile = userDoc.data();

            if (userProfile.active === false) {
                return res.status(403).json({
                    message: 'Usuario inactivo'
                });
            }

            req.user = {
                ...decoded,
                role: userProfile.role || 'viewer'
            };

            next();

        } catch (error) {
            console.error(
                'Error al verificar el perfil del usuario:',
                error
            );

            return res.status(500).json({
                message: 'Error al verificar el usuario'
            });
        }
    });
};