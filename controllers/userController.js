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
    res.send({
      success: true,
      data: token,
    });
  } else {
    next(new ErrorResponse('Invalid email or password', 401));
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
    res.send({
      success: true,
      data: {
        _id, name, email, isAdmin,
      },
    });
  } else {
    next(new ErrorResponse('Not authorized', 401));
  }
});

export { authenticateUser, getUserProfile };
