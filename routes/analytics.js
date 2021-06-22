import express from 'express';
import gatherAnalytics from '../controllers/analytics.js';

import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// apply route middleware
router.use(authenticate);
router.use(isAdmin);

router.route('/').get(isAdmin, gatherAnalytics);

export default router;
