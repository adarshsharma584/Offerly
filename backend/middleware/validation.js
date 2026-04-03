const ApiResponse = require('../utils/ApiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return ApiResponse.badRequest(res, 'Validation failed', {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return ApiResponse.badRequest(res, 'Invalid query parameters', {
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};

module.exports = { validate, validateQuery };
