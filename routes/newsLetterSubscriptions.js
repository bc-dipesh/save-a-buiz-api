import express from 'express';
import {
  subscribeToNewsLetter,
  unsubscribeFromNewsLetter,
} from '../controllers/newsLetterSubscriptions.js';

const router = express.Router();

router.route('/').post(subscribeToNewsLetter).delete(unsubscribeFromNewsLetter);

export default router;
