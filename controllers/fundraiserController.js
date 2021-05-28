import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/fundraiserModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Get all fundraisers
// @route   GET /api/v1/fundraisers
// @access  Public
const getAllFundraisers = asyncHandler(async (req, res) => {
  const fundraisers = await Fundraiser.find({});
  res.status(200).json({ success: true, data: fundraisers });
});

// @desc    Get fundraiser by ID
// @route   GET /api/v1/fundraisers/:id
// @access  Public
const getFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.id);

  if (fundraiser) {
    res.status(200).json({ success: true, data: fundraiser });
  } else {
    next(new ErrorResponse(`Fundraiser not found with the id of ${req.params.id}`, 404));
  }
});

export {
  getAllFundraisers,
  getFundraiserById,
};
