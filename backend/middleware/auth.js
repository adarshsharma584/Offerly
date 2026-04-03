const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      return ApiResponse.unauthorized(res, 'Invalid or expired token');
    }

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    if (!user.isActive) {
      return ApiResponse.unauthorized(res, 'Account is deactivated');
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = authService.verifyAccessToken(token);

      if (decoded) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
          req.userRole = user.role;
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuth };
