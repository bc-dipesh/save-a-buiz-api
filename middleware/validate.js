import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Custom middleware to validate req.body from
 * the incoming request with the schema supplied to it.
 *
 * @param {*} schema The validation schema used to validate the req body.
 */
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (error) {
    return next(new ErrorResponse(error.errors, 400));
  }
};

export default validate;
