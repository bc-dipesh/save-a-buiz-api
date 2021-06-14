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

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', authenticate, getUserProfile);
router.get('/confirm-email/:emailConfirmationToken', confirmEmail);
router.put('/profile', authenticate, updateUserProfile);
router.put('/update-password', authenticate, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;
