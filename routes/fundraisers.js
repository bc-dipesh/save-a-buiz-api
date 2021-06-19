import express from 'express';
import {
  createFundraiser,
  getAllFundraisers,
  getTop3Fundraisers,
  getFundraiserById,
  deleteFundraiserById,
} from '../controllers/fundraisers.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(authenticate, createFundraiser).get(getAllFundraisers);
router.route('/top-3').get(getTop3Fundraisers);

router.route('/:fundraiserId').get(getFundraiserById).delete(authenticate, deleteFundraiserById);

export default router;
