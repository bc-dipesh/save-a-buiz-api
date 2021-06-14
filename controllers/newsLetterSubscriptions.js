import asyncHandler from 'express-async-handler';
import SubscribeToNewsLetter from '../models/NewsLetterSubscription.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
   * @desc    Subscribe to news letter
   * @route   POST /api/v1/subscribe-to-news-letter
   * @access  Public
   */
const subscribeToNewsLetter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const newEmailSubscription = await SubscribeToNewsLetter.create({ email });

  if (newEmailSubscription) {
    return res.status(200).json({ success: true, data: 'Email Successfully subscribed to newsletter' });
  }
  return next(new ErrorResponse('Unable to subscribe email to newsletter', 400));
});

/**
   * @desc    Unsubscribe email from news letter
   * @route   DELETE /api/v1/subscribe-to-news-letter
   * @access  Public
   */
const unsubscribeFromNewsLetter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const subscribedEmail = await SubscribeToNewsLetter.findOne({ email });

  if (subscribedEmail) {
    await SubscribeToNewsLetter.findByIdAndDelete(subscribedEmail._id);
    return res.status(200).json({ success: true, data: 'Email successfully unsubscribed from newsletter' });
  }
  return next(new ErrorResponse('Email to unsubscribe not found', 400));
});

export { subscribeToNewsLetter, unsubscribeFromNewsLetter };
