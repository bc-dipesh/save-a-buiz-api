import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorMiddleware.js';
import fundraiserRoutes from './routes/fundraiserRoutes.js';
import userRoutes from './routes/userRoutes.js';
import newsLetterSubscriptionRoutes from './routes/newsLetterSubscriptionRoutes.js';

dotenv.config({ path: './config/.env' });
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// cors
app.use(cors());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// bodyparser
app.use(express.json());

// mount routes
app.use('/api/v1/fundraisers', fundraiserRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subscribe-to-news-letter', newsLetterSubscriptionRoutes);

// error handling middleware
app.use(errorHandler);

app.listen(
  PORT,
  console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
