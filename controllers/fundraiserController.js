import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/fundraiserModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @desc    Create fundraiser
// @route   POST /api/v1/fundraisers
// @access  Private
const createFundraiser = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.create({ ...req.body, organizer: req.user._id });

  if (fundraiser) {
    res.status(200).json({ success: true, data: fundraiser });
  } else {
    next(new ErrorResponse('Invalid form data', 400));
  }
});

// @desc    Get all fundraisers
// @route   GET /api/v1/fundraisers
// @access  Public
const getAllFundraisers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? {
    title: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};
  const fundraisers = await Fundraiser.find({ ...keyword }).populate('organizer', 'name -_id');
  res.status(200).json({ success: true, data: fundraisers });
});

// @desc    Get fundraiser by ID
// @route   GET /api/v1/fundraisers/:id
// @access  Public
const getFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.id).populate('organizer', 'name -_id');

  if (fundraiser) {
    res.status(200).json({ success: true, data: fundraiser });
  } else {
    next(new ErrorResponse(`Fundraiser not found with the id of ${req.params.id}`, 404));
  }
});

// @desc    Delete fundraiser by ID
// @route   DELETE /api/v1/fundraisers/:id
// @access  Private
const deleteFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.id);

  if (fundraiser) {
    await Fundraiser.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: 'Fundraiser successfully deleted' });
  } else {
    next(new ErrorResponse(`Fundraiser not found with the id of ${req.params.id}`, 404));
  }
});

export {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  deleteFundraiserById,
};
