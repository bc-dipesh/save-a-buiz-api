import express from 'express';
import {
  authenticateUser, deleteUserById, getAllUsers, getUserProfile, registerUser, updateUserProfile,
} from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middleware/authenticateMiddleware.js';

const router = express.Router();

router.route('/login').post(authenticateUser);
router.route('/register').post(registerUser);
router.route('/profile').get(authenticate, getUserProfile).put(authenticate, updateUserProfile);
router.route('/').get(authenticate, isAdmin, getAllUsers);
router.route('/:id').delete(authenticate, isAdmin, deleteUserById);

export default router;
