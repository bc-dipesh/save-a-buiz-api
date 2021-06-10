import express from 'express';
import {
  createFundraiser, getAllFundraisers, getFundraiserById, deleteFundraiserById,
} from '../controllers/fundraiserController.js';
import { authenticate } from '../middleware/authenticateMiddleware.js';

const router = express.Router();

router.route('/').post(authenticate, createFundraiser).get(getAllFundraisers);
router.route('/:id').get(getFundraiserById).delete(authenticate, deleteFundraiserById);

export default router;
