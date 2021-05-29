import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import generateToken from '../utils/generateToken.js';

// @desc    Authenticate user & get token
// @route   POST /api/v1/users/login
// @access  Public
const authenticateUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isPasswordMatch = await user.comparePassword(password);

  if (user && isPasswordMatch) {
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      data: { name: user.name, email, token },
    });
  } else {
    next(new ErrorResponse('Invalid email or password', 401));
  }
});

// @desc    Register user & get token
// @route   POST /api/v1/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    next(new ErrorResponse('User already exists', 400));
  } else {
    const newUser = await User.create(req.body);

    if (newUser) {
      const token = generateToken(newUser._id);
      res.status(201).json({
        success: true,
        data: token,
      });
    } else {
      next(new ErrorResponse('Invalid user data', 400));
    }
  }
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (user) {
    const {
      _id, name, email, isAdmin,
    } = user;
    res.status(200).json({
      success: true,
      data: {
        _id, name, email, isAdmin,
      },
    });
  } else {
    next(new ErrorResponse('Not authorized', 401));
  }
});

export { authenticateUser, registerUser, getUserProfile };
