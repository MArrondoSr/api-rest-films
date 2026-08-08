import { adminDb } from '../data/admin.js';

export const getAllUsers = async (req, res) => {
    try {
        const snapshot = await adminDb
            .collection('users')
            .get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(users);

    } catch (error) {
        console.error('Error al obtener usuarios:', error);

        res.status(500).json({
            message: 'Error al obtener los usuarios'
        });
    }
};

export const approveUser = async (req, res) => {
    try {
        const id = req.params.id;

        const userRef = adminDb
            .collection('users')
            .doc(id);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await userRef.update({
            approved: true,
            active: true
        });

        res.status(200).json({
            message: 'Usuario autorizado correctamente'
        });

    } catch (error) {
        console.error('Error al autorizar usuario:', error);

        res.status(500).json({
            message: 'Error al autorizar el usuario'
        });
    }
};

export const activateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const userRef = adminDb
            .collection('users')
            .doc(id);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await userRef.update({
            active: true
        });

        res.status(200).json({
            message: 'Usuario activado correctamente'
        });

    } catch (error) {
        console.error('Error al activar usuario:', error);

        res.status(500).json({
            message: 'Error al activar el usuario'
        });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.user.id === id) {
            return res.status(400).json({
                message: 'No podés desactivar tu propia cuenta'
            });
        }

        const userRef = adminDb
            .collection('users')
            .doc(id);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await userRef.update({
            active: false
        });

        res.status(200).json({
            message: 'Usuario desactivado correctamente'
        });

    } catch (error) {
        console.error('Error al desactivar usuario:', error);

        res.status(500).json({
            message: 'Error al desactivar el usuario'
        });
    }
};

export const changeUserRole = async (req, res) => {
    try {

        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body recibido:', req.body);
        
        const id = req.params.id;
        const { role } = req.body;

        if (!['viewer', 'admin'].includes(role)) {
            return res.status(400).json({
                message: 'Rol inválido'
            });
        }

        if (req.user.id === id && role !== 'admin') {
            return res.status(400).json({
                message: 'No podés quitarte tu propio rol de administrador'
            });
        }

        const userRef = adminDb
            .collection('users')
            .doc(id);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await userRef.update({
            role
        });

        res.status(200).json({
            message: 'Rol actualizado correctamente'
        });

    } catch (error) {
        console.error('Error al modificar rol:', error);

        res.status(500).json({
            message: 'Error al modificar el rol'
        });
    }
};