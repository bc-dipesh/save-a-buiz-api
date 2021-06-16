import express from 'express';
import {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  deleteFundraiserById,
} from '../controllers/fundraisers.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(authenticate, createFundraiser).get(getAllFundraisers);

router.route('/:fundraiserId').get(getFundraiserById).delete(authenticate, deleteFundraiserById);

export default router;
