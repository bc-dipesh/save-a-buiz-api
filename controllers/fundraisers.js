import asyncHandler from 'express-async-handler';
import Fundraiser from '../models/Fundraiser.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * @desc    Create fundraiser
 * @route   POST /api/v1/fundraisers
 * @access  Private
 */
const createFundraiser = asyncHandler(async (req, res) => {
  const fundraiser = await Fundraiser.create({ ...req.body, organizer: req.user._id });
  return res.status(200).json({ success: true, data: fundraiser });
});

/**
 * @desc    Get all fundraisers
 * @route   GET /api/v1/fundraisers
 * @route   GET /api/v1/users/:userId/fundraisers
 * @access  Public
 */
const getAllFundraisers = asyncHandler(async (req, res, next) => {
  if (req.params.userId) {
    const fundraisers = await Fundraiser.find({ organizer: { _id: req.params.userId } }).populate(
      'organizer',
      'name -_id'
    );
    if (fundraisers) {
      return res.status(200).json({
        success: true,
        data: fundraisers,
      });
    }
    return next(
      new ErrorResponse(
        'You must be logged in to access this route. Please login and try again.',
        401
      )
    );
  }

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const fundraisers = await Fundraiser.find({ ...keyword }).populate('organizer', 'name -_id');
  return res.status(200).json({ success: true, data: fundraisers });
});

/**
 * @desc    Get fundraiser by ID
 * @route   GET /api/v1/fundraisers/:fundraiserId
 * @access  Public
 */
const getFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.fundraiserId).populate(
    'organizer',
    'name -_id'
  );

  if (fundraiser) {
    return res.status(200).json({ success: true, data: fundraiser });
  }
  return next(
    new ErrorResponse(
      `Fundraiser not found with the id of ${req.params.fundraiserId}. Please check the id and try again.`,
      404
    )
  );
});

/**
 * @desc    Delete fundraiser by ID
 * @route   DELETE /api/v1/fundraisers/:fundraiserId
 * @access  Private
 */
const deleteFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.fundraiserId);

  if (fundraiser) {
    await Fundraiser.findByIdAndDelete(req.params.fundraiserId);
    return res.status(200).json({ success: true, data: 'Fundraiser successfully deleted' });
  }
  return next(
    new ErrorResponse(
      `Fundraiser not found with the id of ${req.params.fundraiserId}. Please check the id and try again.`,
      404
    )
  );
});

export { createFundraiser, getAllFundraisers, getFundraiserById, deleteFundraiserById };
