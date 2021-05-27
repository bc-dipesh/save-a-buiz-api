import express from 'express';
import { getAllFundraisers, getFundraiserById } from '../controllers/fundraiserController.js';

const router = express.Router();

router.route('/').get(getAllFundraisers);
router.route('/:id').get(getFundraiserById);

export default router;
