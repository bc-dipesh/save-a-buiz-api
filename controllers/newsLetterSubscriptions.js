import asyncHandler from 'express-async-handler';
import SubscribeToNewsLetter from '../models/NewsLetterSubscription.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * @desc    Get news letter subscribers
 * @route   GET /api/v1/subscribe-to-news-letter
 * @access  Public
 */
const getNewsLetterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await SubscribeToNewsLetter.find({});

  return res.status(200).json({ success: true, data: subscribers });
});

/**
 * @desc    Subscribe to news letter
 * @route   POST /api/v1/subscribe-to-news-letter
 * @access  Public
 */
const subscribeToNewsLetter = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const newEmailSubscription = await SubscribeToNewsLetter.create({ email });

  if (newEmailSubscription) {
    return res
      .status(200)
      .json({ success: true, data: 'Email Successfully subscribed to newsletter' });
  }
  return next(new ErrorResponse('Unable to subscribe email to newsletter', 400));
});

/**
 * @desc    Update subscriber email
 * @route   PUT /api/v1/subscribe-to-news-letter/:id
 * @access  Public
 */
const updateSubscriberEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const subscriber = await SubscribeToNewsLetter.findByIdAndUpdate(req.params.id, {
    email,
  });

  if (subscriber) {
    return res.status(200).json({ success: true, data: 'Email Successfully updated.' });
  }
  return next(new ErrorResponse('Unable to find the email to update.', 400));
});

/**
 * @desc    Unsubscribe email from news letter
 * @route   DELETE /api/v1/subscribe-to-news-letter/:id
 * @access  Public
 */
const unsubscribeFromNewsLetter = asyncHandler(async (req, res, next) => {
  const subscribedEmail = await SubscribeToNewsLetter.findById(req.params.id);

  if (subscribedEmail) {
    await SubscribeToNewsLetter.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, data: 'Email successfully unsubscribed from newsletter' });
  }
  return next(new ErrorResponse('Email to unsubscribe not found', 400));
});

export {
  getNewsLetterSubscribers,
  subscribeToNewsLetter,
  updateSubscriberEmail,
  unsubscribeFromNewsLetter,
};
