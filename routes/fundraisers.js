import express from 'express';
import {
  createFundraiser,
  deleteFundraiserById,
  getAllFundraisers,
  getFundraiserById,
  getTop3Fundraisers,
  updateFundraiserById,
  updateFundraiserDonations,
} from '../controllers/fundraisers.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(authenticate, createFundraiser).get(getAllFundraisers);
router.route('/top-3').get(getTop3Fundraisers);

router
  .route('/:fundraiserId')
  .get(getFundraiserById)
  .delete(authenticate, deleteFundraiserById)
  .put(authenticate, updateFundraiserById);

router.route('/:fundraiserId/donations').put(authenticate, updateFundraiserDonations);

export default router;
