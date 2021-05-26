import express from 'express';
import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/fundraiserModel.js';

const router = express.Router();

// @desc    Fetch all fundraisers
// @route   GET /api/v1/fundraisers
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const fundraisers = await Fundraiser.find({});

    res.send(fundraisers);
  }),
);

// @desc    Fetch single fundraiser
// @route   GET /api/v1/fundraisers/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const fundraiser = await Fundraiser.findById(req.params.id);

    res.send(fundraiser);
  }),
);

export default router;
