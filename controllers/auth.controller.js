import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../data/data.js';
import { generateToken } from '../utils/token-generator.js';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y contraseña son obligatorios'
            });
        }

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const firebaseUser = userCredential.user;

        const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email
        };

        const token = generateToken(user);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error de autenticación:', error.code);

        res.status(401).json({
            message: 'Credenciales inválidas'
        });
    }
}