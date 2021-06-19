import express from 'express';
import {
  subscribeToNewsLetter,
  unsubscribeFromNewsLetter,
} from '../controllers/newsLetterSubscriptions.js';
import newsLetterSubscriptionSchema from '../validationSchemas/newsLetterSubscription.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router
  .route('/')
  .post(validate(newsLetterSubscriptionSchema), subscribeToNewsLetter)
  .delete(validate(newsLetterSubscriptionSchema), unsubscribeFromNewsLetter);

export default router;
