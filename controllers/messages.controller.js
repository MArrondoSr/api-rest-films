import {
    createMessageService,
    getAllMessagesService,
    markMessageAsReadService,
    deleteMessageService
} from '../services/messages.service.js';

export const createMessage = async (req, res) => {
    try {
        const message = req.body.message?.trim();

        if (!message) {
            return res.status(400).json({
                message: 'El mensaje no puede estar vacío'
            });
        }

        const messageData = {
            userId: req.user.id,
            email: req.user.email,
            message: message,
            status: 'nuevo',
            createdAt: new Date()
        };

        const newMessage = await createMessageService(messageData);

        res.status(201).json(newMessage);

    } catch (error) {
        console.error('Error al guardar el mensaje:', error);

        res.status(500).json({
            message: 'Error al guardar el mensaje'
        });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const messages = await getAllMessagesService();

        res.status(200).json(messages);

    } catch (error) {
        console.error('Error al obtener los mensajes:', error);

        res.status(500).json({
            message: 'Error al obtener los mensajes'
        });
    }
};

export const markMessageAsRead = async (req, res) => {
    try {
        const id = req.params.id;

        const updated = await markMessageAsReadService(id);

        if (!updated) {
            return res.status(404).json({
                message: 'Mensaje no encontrado'
            });
        }

        res.status(200).json({
            message: 'Mensaje marcado como leído'
        });

    } catch (error) {
        console.error('Error al actualizar el mensaje:', error);

        res.status(500).json({
            message: 'Error al actualizar el mensaje'
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;

        const deleted = await deleteMessageService(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Mensaje no encontrado'
            });
        }

        res.status(200).json({
            message: 'Mensaje eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar el mensaje:', error);

        res.status(500).json({
            message: 'Error al eliminar el mensaje'
        });
    }
};