const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');
const { sendOtpSchema, verifyOtpSchema } = require('../utils/validators');

// Public routes
router.post('/send-otp', authLimiter, validate(sendOtpSchema), authController.sendOTP);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOTP);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
