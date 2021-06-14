import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

const checkIfHeaderIsValid = (req) => req.headers.authorization && req.headers.authorization.startsWith('Bearer');

const decodeToken = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return payload;
  } catch (error) {
    throw new ErrorResponse(
      'Only admin have access to this route. Please login with a admin user account.',
      401,
    );
  }
};

const authenticate = asyncHandler(async (req, res, next) => {
  if (checkIfHeaderIsValid(req)) {
    const decodedToken = decodeToken(req);
    const user = await User.findById(decodedToken.id);
    req.user = user;
    next();
  } else {
    next(new ErrorResponse(
      'You are not authorized to access this route. Please login or register as a user to access this route.',
      401,
    ));
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new ErrorResponse(
      'Only admin have access to this route. Please login with a admin user account.',
      401,
    ));
  }
});

export { authenticate, isAdmin };
