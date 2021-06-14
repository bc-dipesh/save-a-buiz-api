import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';

// route files
import auth from './routes/auth.js';
import users from './routes/users.js';
import fundraisers from './routes/fundraisers.js';
import fileUploads from './routes/fileUploads.js';
import newsLetterSubscriptions from './routes/newsLetterSubscriptions.js';
import ErrorResponse from './utils/ErrorResponse.js';

// load env vars
dotenv.config({ path: './config/.env' });

// connect to database
connectDB();

// create an express app
const app = express();

// json body-parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// enable cors
app.use(cors());

// set static folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/fundraisers', fundraisers);
app.use('/api/v1/file-uploads', fileUploads);
app.use('/api/v1/subscribe-to-news-letter', newsLetterSubscriptions);

// 404 not found route
app.use(async (req, res, next) => next(new ErrorResponse(
  `Route ${req.url} not found. Please check and try again with a different route.`,
  400,
)));

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`App running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
