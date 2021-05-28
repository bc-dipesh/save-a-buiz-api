import express from 'express';
import { authenticateUser, getUserProfile, registerUser } from '../controllers/userController.js';
import authenticate from '../middleware/authenticateMiddleware.js';

const router = express.Router();

router.route('/login').post(authenticateUser);
router.route('/register').post(registerUser);
router.route('/profile').get(authenticate, getUserProfile);

export default router;
