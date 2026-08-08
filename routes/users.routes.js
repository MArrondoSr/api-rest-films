import express from 'express';

import {
    getAllUsers,
    approveUser,
    activateUser,
    deactivateUser,
    changeUserRole
} from '../controllers/users.controller.js';

import { authentication } from '../middlewares/authentication.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = express.Router();

router.use(authentication);
router.use(requireAdmin);

router.get('/', getAllUsers);

router.put('/:id/approve', approveUser);

router.put('/:id/activate', activateUser);

router.put('/:id/deactivate', deactivateUser);

router.put('/:id/role', changeUserRole);


export default router;