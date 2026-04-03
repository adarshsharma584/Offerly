const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/ApiResponse');
const config = require('../config/env');

const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many OTP requests',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Please wait before requesting another OTP'
    }
  }
});

const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many scan attempts',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Please wait before scanning again'
    }
  }
});

module.exports = { globalLimiter, authLimiter, scanLimiter };
