import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';

import { auth } from '../data/data.js';
import { generateToken } from '../utils/token-generator.js';
import { adminDb } from '../data/admin.js';

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
            if (!firebaseUser.emailVerified) {
            return res.status(403).json({
                message: 'Debés verificar tu correo electrónico antes de iniciar sesión'
            });
        }
        const userDoc = await adminDb
            .collection('users')
            .doc(firebaseUser.uid)
            .get();

        if (!userDoc.exists) {
            return res.status(403).json({
                message: 'El usuario no tiene un perfil habilitado'
            });
        }

        const userProfile = userDoc.data();

        if (userProfile.active === false) {
            return res.status(403).json({
                message: 'Usuario inactivo'
            });
        }

        const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: userProfile.role || 'viewer'
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

export async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email y contraseña son obligatorios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const firebaseUser = userCredential.user;

        await sendEmailVerification(firebaseUser);

        await adminDb
            .collection('users')
            .doc(firebaseUser.uid)
            .set({
                email: firebaseUser.email,
                name: name || '',
                role: 'viewer',
                active: true
            });

        return res.status(201).json({
            message: 'Usuario registrado correctamente'
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error.code, error.message);

        if (error.code === 'auth/email-already-in-use') {
            return res.status(409).json({
                message: 'El email ya está registrado'
            });
        }

        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({
                message: 'El email no es válido'
            });
        }

        return res.status(500).json({
            message: 'Error al registrar el usuario'
        });
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'El email es obligatorio'
            });
        }

        await sendPasswordResetEmail(auth, email);

        return res.status(200).json({
            message: 'Se envió un correo para restablecer la contraseña'
        });

    } catch (error) {
        console.error(
            'Error en recuperación de contraseña:',
            error.code,
            error.message
        );

        /*
         * No revelamos demasiado sobre la existencia
         * de una cuenta determinada.
         */
        return res.status(200).json({
            message:
                'Si el correo corresponde a una cuenta válida, recibirás instrucciones para restablecer la contraseña'
        });
    }
}

export async function resendVerification(req, res) {
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

        if (firebaseUser.emailVerified) {
            return res.status(400).json({
                message: 'El correo ya está verificado'
            });
        }

        await sendEmailVerification(firebaseUser);

        return res.status(200).json({
            message: 'Correo de verificación reenviado'
        });

    } catch (error) {
        console.error(
            'Error al reenviar verificación:',
            error.code,
            error.message
        );

        return res.status(400).json({
            message: 'No se pudo reenviar el correo de verificación'
        });
    }
}