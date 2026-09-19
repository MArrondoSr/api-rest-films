import express from 'express';

import {
    createMessage,
    getAllMessages,
    markMessageAsRead,
    deleteMessage
} from '../controllers/messages.controller.js';

import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = express.Router();

router.post('/', createMessage);

router.get('/', requireAdmin, getAllMessages);

router.put('/:id/read', requireAdmin, markMessageAsRead);

router.delete('/:id', requireAdmin, deleteMessage);

export default router;