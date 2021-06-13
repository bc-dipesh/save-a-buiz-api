import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Fundraiser from '../models/fundraiserModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import generateToken from '../utils/generateToken.js';

// @desc    Authenticate user & get token
// @route   POST /api/v1/users/login
// @access  Public
const authenticateUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const isPasswordMatch = await user.comparePassword(password);

    if (user && isPasswordMatch) {
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        data: {
          name: user.name, email, isAdmin: user.isAdmin, token,
        },
      });
    }
  }
  return next(new ErrorResponse('Invalid email or password', 401));
});

// @desc    Register user & get token
// @route   POST /api/v1/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const newUser = await User.create(req.body);

  const token = generateToken(newUser._id);
  return res.status(201).json({
    success: true,
    data: { name: newUser.name, email: newUser.email, token },
  });
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const {
      _id, name, email, isAdmin,
    } = req.user;
    return res.status(200).json({
      success: true,
      data: {
        _id, name, email, isAdmin,
      },
    });
  }
  return next(new ErrorResponse('Not authorized', 401));
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user) {
    const { name, email, password } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }
  return next(new ErrorResponse('Not authorized', 401));
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  if (users) {
    return res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  }
  return next(new ErrorResponse('Not authorized', 401));
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    const {
      _id, name, email, isAdmin,
    } = user;
    return res.status(200).json({
      success: true,
      data: {
        _id, name, email, isAdmin,
      },
    });
  }
  return next(new ErrorResponse('User not found', 404));
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const { name, email, isAdmin } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin;

    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }
  return next(new ErrorResponse('User not found', 404));
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    return res.status(200).json({
      success: true,
      data: {
        message: 'User successfully deleted',
      },
    });
  }
  return next(new ErrorResponse('User not found', 404));
});

// @desc    Get all fundraisers created by current user
// @route   GET /api/v1/users/fundraisers
// @access  Private
const getAllUserFundraisers = asyncHandler(async (req, res, next) => {
  const fundraisers = await Fundraiser.find({ organizer: { _id: req.user._id } });
  if (fundraisers) {
    return res.status(200).json({
      success: true,
      data: {
        fundraisers,
      },
    });
  }
  return next(new ErrorResponse('Not authorized', 401));
});

export {
  authenticateUser, registerUser, getUserProfile, updateUserProfile, getAllUsers, getUserById,
  updateUser, deleteUserById, getAllUserFundraisers,
};
