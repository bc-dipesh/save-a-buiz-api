import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/fundraiserModel.js';

// @desc    Get all fundraisers
// @route   GET /api/v1/fundraisers
// @access  Public
const getAllFundraisers = asyncHandler(async (req, res) => {
  const fundraisers = await Fundraiser.find({});

  res.send(fundraisers);
});

// @desc    Get fundraiser by ID
// @route   GET /api/v1/fundraisers/:id
// @access  Public
const getFundraiserById = asyncHandler(async (req, res) => {
  const fundraiser = await Fundraiser.findById(req.params.id);

  res.send(fundraiser);
});

export {
  getAllFundraisers,
  getFundraiserById,
};
