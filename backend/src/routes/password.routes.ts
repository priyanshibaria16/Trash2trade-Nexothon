import { Router } from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/password.controller';

const router = Router();

// Public routes
router.post('/forgot', requestPasswordReset); // Request password reset
router.post('/reset', resetPassword); // Reset password

export default router;