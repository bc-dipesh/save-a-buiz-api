import express from 'express';
import { gatherAnalytics, appVisitsAnalytics } from '../controllers/analytics.js';

import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, gatherAnalytics);
router.get('/app-visits', appVisitsAnalytics);

export default router;
