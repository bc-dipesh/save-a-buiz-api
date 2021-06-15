import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import sendEmail from '../utils/sendEmail.js';

/**
   * @desc    Register user
   * @route   POST /api/v1/auth/register
   * @access  Public
   */
const registerUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  // grab token and create email confirmation url
  const confirmEmailToken = user.generateEmailConfirmToken();
  const confirmEmailUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/confirm-email/${confirmEmailToken}`;

  const message = `You are receiving this email because you need to confirm your email address. 
  Please copy and paste this url in the address bar of your browser:\n\n${confirmEmailUrl}`;

  // prevent temporary
  user.save({ validationBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: 'Email confirmation token',
    message,
  });

  // get user authentication token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    data: {
      token,
      user,
      confirmEmailUrl,
    },
  });
});

/**
   * @desc    login user
   * @route   POST /api/v1/auth/login
   * @access  Public
   */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email || !password) {
    return next(new ErrorResponse(
      'Email and password cannot be empty. Please try again with a email and password',
      400,
    ));
  }

  // check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse(
      'Email and/or password is incorrect. Please check your email and/or password and try again',
      401,
    ));
  }

  // check if password matches
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse(
      'Email and/or password is incorrect. Please check your email and/or password and try again',
      401,
    ));
  }

  // get user authentication token
  const token = user.getSignedJwtToken();

  return res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

/**
   * @desc    Get user profile
   * @route   GET /api/v1/auth/profile
   * @access  Private
   */
const getUserProfile = asyncHandler(async (req, res) => {
  // user is already available in req due to the protect middleware
  const { user } = req;

  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
   * @desc    Update user profile
   * @route   PUT /api/v1/auth/profile
   * @access  Private
   */
const updateUserProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    mobilePhoneNumber: req.body.mobilePhoneNumber || req.user.mobilePhoneNumber,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
   * @desc    Update user password
   * @route   PUT /api/v1/auth/update-password
   * @access  Private
   */
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!req.body.currentPassword || !req.body.newPassword) {
    return next(new ErrorResponse(
      'Current password and/or new password field is empty. Please provide both the passwords so we can verify and update your password.',
      400,
    ));
  }

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(
      'Your old password did not match. Please check your password and try again.',
      401,
    ));
  }

  user.password = req.body.newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
   * @desc    Forgot password
   * @route   POST /api/v1/auth/forgot-password
   * @access  Public
   */
const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse(
      'Email is empty. Please provide your email so that we can send you a password reset url.',
      400,
    ));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(
      'Unable to find user with the email you provided. Please check your email and try again.',
      404,
    ));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
                  Please submit your new password to this url with a put request:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Password reset request sent successfully. Please check your email.',
        resetUrl,
      },
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(
      'Something went wrong. We were unable to send you password reset link. Please try again.',
      500,
    ));
  }
});

/**
   * @desc    Reset password
   * @route   PUT /api/v1/auth/reset-password/:resetToken
   * @access  Public
   */
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(
      'Cannot find user with the reset token you provided. Please check the token and try again or regenerate a new password reset token.',
      400,
    ));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    data: {
      user,
      token: user.getSignedJwtToken(),
    },
  });
});

/**
   * @desc    Confirm Email
   * @route   GET /api/v1/auth/confirm-email/:emailConfirmationToken
   * @access  Public
   */
const confirmEmail = asyncHandler(async (req, res, next) => {
  // grab token from email
  const token = req.params.emailConfirmationToken;

  if (!token) {
    return next(new ErrorResponse(
      'Email confirmation token is empty. Please copy and use the email confirmation token sent to your email and try again.',
      400,
    ));
  }

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(splitToken)
    .digest('hex');

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse(
      'Cannot find a user with the email confirmation token you provided. Please check the token we sent you in your email and try again.',
      400,
    ));
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });

  const redirectUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/user/profile'
    : 'https://save-a-buiz-api.herokuapp.com/';

  return res.redirect(redirectUrl).json({
    success: true,
    data: {
      user,
      token: user.getSignedJwtToken(),
    },
  });
});

export {
  registerUser,
  login,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  confirmEmail,
};
