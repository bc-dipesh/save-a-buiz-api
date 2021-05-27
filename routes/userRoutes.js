import express from 'express';
import { authenticateUser, getUserProfile } from '../controllers/userController.js';
import authenticate from '../middleware/authenticateMiddleware.js';

const router = express.Router();

router.route('/login').post(authenticateUser);
router.route('/profile').get(authenticate, getUserProfile);

export default router;
