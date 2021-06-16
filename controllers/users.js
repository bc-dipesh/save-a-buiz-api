import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  return res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:userId
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res, next) => {
  if (!req.params.userId) {
    next(
      new ErrorResponse(
        'userId parameter is empty. Please provide userId of the user to get their details.',
        400
      )
    );
  }

  const user = await User.findById(req.params.userId);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:userId
 * @access  Private/Admin
 */
const updateUserById = asyncHandler(async (req, res, next) => {
  if (!req.params.userId) {
    next(
      new ErrorResponse(
        'userId parameter is empty. Please provide userId of the user to update their details.',
        400
      )
    );
  }

  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:userId
 * @access  Private/Admin
 */
const deleteUserById = asyncHandler(async (req, res, next) => {
  if (!req.params.userId) {
    next(
      new ErrorResponse(
        'userId parameter is empty. Please provide userId of the user to delete the user.',
        400
      )
    );
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(
        `Unable to find user with the id of ${req.params.userId}. Please check the id and try again.`,
        404
      )
    );
  }

  await user.remove();

  return res.status(200).json({
    success: true,
    data: 'User deleted successfully',
  });
});

export { getAllUsers, getUserById, createUser, updateUserById, deleteUserById };
