import jwt from 'jsonwebtoken';
import 'dotenv/config';

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

    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Token inválido o vencido'
            });
        }

        req.user = decoded;
        next();
    });
};