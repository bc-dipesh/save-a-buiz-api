import express from 'express';
import { getAllFundraisers, getFundraiserById } from '../controllers/fundraiserController';

const router = express.Router();

router.route('/').get(getAllFundraisers);
router.route('/:id').get(getFundraiserById);

export default router;
