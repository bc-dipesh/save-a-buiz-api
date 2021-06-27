import express from 'express';
import {
  getNewsLetterSubscribers,
  subscribeToNewsLetter,
  updateSubscriberEmail,
  unsubscribeFromNewsLetter,
} from '../controllers/newsLetterSubscriptions.js';
import newsLetterSubscriptionSchema from '../validationSchemas/newsLetterSubscription.js';
import validate from '../middleware/validate.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(authenticate, isAdmin, getNewsLetterSubscribers)
  .post(validate(newsLetterSubscriptionSchema), subscribeToNewsLetter);

router
  .route('/:id')
  .put(validate(newsLetterSubscriptionSchema), updateSubscriberEmail)
  .delete(unsubscribeFromNewsLetter);

export default router;
