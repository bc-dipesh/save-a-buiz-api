import express from 'express';
import {
  registerUser,
  login,
  getUserProfile,
  confirmEmail,
  updateUserProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js';

import { authenticate } from '../middleware/auth.js';
import { loginSchema, registerSchema, passwordUpdateSchema } from '../validationSchemas/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), login);
router.get('/profile', authenticate, getUserProfile);
router.get('/confirm-email/:emailConfirmationToken', confirmEmail);
router.put('/profile', authenticate, updateUserProfile);
router.put('/update-password', authenticate, validate(passwordUpdateSchema), updatePassword);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:resetToken', resetPassword);

export default router;
