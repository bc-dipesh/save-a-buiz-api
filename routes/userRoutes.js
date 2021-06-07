import express from 'express';
import {
  authenticateUser, deleteUserById, getAllUsers, getUserById,
  getUserProfile, registerUser, updateUser, updateUserProfile,
} from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middleware/authenticateMiddleware.js';

const router = express.Router();

router.route('/login')
  .post(authenticateUser);
router.route('/register')
  .post(registerUser);
router.route('/profile')
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);
router.route('/')
  .get(authenticate, isAdmin, getAllUsers);
router.route('/:id')
  .delete(authenticate, isAdmin, deleteUserById)
  .get(authenticate, isAdmin, getUserById)
  .put(authenticate, isAdmin, updateUser);

export default router;
