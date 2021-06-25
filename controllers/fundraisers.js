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
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  // pagination logic
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Fundraiser.countDocuments({ ...keyword });

  if (req.params.userId) {
    const fundraisers = await Fundraiser.find({ organizer: { _id: req.params.userId } })
      .populate(['organizer', 'donations.donor'])
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (fundraisers) {
      return res.status(200).json({
        success: true,
        data: fundraisers,
        pages: Math.ceil(fundraisers.length / pageSize),
        page,
      });
    }
    return next(
      new ErrorResponse(
        'You must be logged in to access this route. Please login and try again.',
        401
      )
    );
  }

  if (!req.query.pageNumber) {
    const fundraisers = await Fundraiser.find({ ...keyword }).populate([
      'organizer',
      'donations.donor',
    ]);

    return res.status(200).json({ success: true, data: fundraisers });
  }

  const fundraisers = await Fundraiser.find({ ...keyword })
    .populate(['organizer', 'donations.donor'])
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return res
    .status(200)
    .json({ success: true, data: fundraisers, pages: Math.ceil(count / pageSize), page });
});

/**
 * @desc    Get top 3 fundraisers
 * @route   GET /api/v1/fundraisers/top-3
 * @access  Public
 */
const getTop3Fundraisers = asyncHandler(async (req, res) => {
  const fundraisers = await Fundraiser.find({})
    .populate(['organizer', 'donations.donor'])
    .sort('donations')
    .limit(3);

  return res.status(200).json({ success: true, data: fundraisers });
});

/**
 * @desc    Get fundraiser by ID
 * @route   GET /api/v1/fundraisers/:fundraiserId
 * @access  Public
 */
const getFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.fundraiserId).populate([
    'organizer',
    'donations.donor',
  ]);

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

/**
 * @desc    Update fundraiser by ID
 * @route   PUT /api/v1/fundraisers/:fundraiserId
 * @access  Private
 */
const updateFundraiserById = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.fundraiserId);

  if (fundraiser) {
    const { collected, goal } = fundraiser;

    if (collected >= goal) {
      req.body.isGoalCompleted = true;
    }

    const updatedFundraiser = await Fundraiser.findByIdAndUpdate(
      req.params.fundraiserId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('organizer');

    return res.status(200).json({ success: true, data: updatedFundraiser });
  }

  return next(
    new ErrorResponse(
      `Fundraiser not found with the id of ${req.params.fundraiserId}. Please check the id and try again.`,
      404
    )
  );
});

/**
 * @desc    Update fundraiser donations
 * @route   PUT /api/v1/fundraisers/:fundraiserId/donations
 * @access  Private
 */
const updateFundraiserDonations = asyncHandler(async (req, res, next) => {
  const fundraiser = await Fundraiser.findById(req.params.fundraiserId);

  if (fundraiser) {
    fundraiser.donations.push({
      donor: req.user._id,
      refId: req.body.refId,
      amount: req.body.amt,
    });

    fundraiser.collected += Number(req.body.amt);

    await fundraiser.save();

    const updatedFundraiser = await Fundraiser.findById(req.params.fundraiserId).populate(
      'organizer'
    );

    return res.status(200).json({ success: true, data: updatedFundraiser });
  }

  return next(
    new ErrorResponse(
      `Fundraiser not found with the id of ${req.params.fundraiserId}. Please check the id and try again.`,
      404
    )
  );
});

export {
  createFundraiser,
  getAllFundraisers,
  getTop3Fundraisers,
  getFundraiserById,
  deleteFundraiserById,
  updateFundraiserById,
  updateFundraiserDonations,
};
