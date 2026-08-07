import express from 'express'; 
import { login, register, forgotPassword, resendVerification } from '../controllers/auth.controller.js'; 

const router = express.Router(); 
router.post('/login', login); 
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/resend-verification', resendVerification);

export default router;