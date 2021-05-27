import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/ErrorResponse.js';

const checkIfHeaderIsValid = (req) => req.headers.authorization && req.headers.authorization.startsWith('Bearer');

const decodeToken = (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return payload;
  } catch (error) {
    throw new ErrorResponse('Not authorized', 401);
  }
};

const authenticate = asyncHandler(async (req, res, next) => {
  let decodedToken = '';

  if (checkIfHeaderIsValid(req)) {
    decodedToken = decodeToken(req);
    req.userId = decodedToken.id;
    next();
  } else {
    next(new ErrorResponse('Not authorized', 401));
  }
});

export default authenticate;
