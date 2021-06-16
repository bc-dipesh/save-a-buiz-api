import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../controllers/users.js';

import { authenticate, isAdmin } from '../middleware/auth.js';

// include other resource routers
import fundraiserRouter from './fundraisers.js';

const router = express.Router();

// re-route into other resource routers
router.use('/:userId/fundraisers', fundraiserRouter);

// apply route middleware
router.use(authenticate);
router.use(isAdmin);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:userId').get(getUserById).put(updateUserById).delete(deleteUserById);

export default router;
