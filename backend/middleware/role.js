const ApiResponse = require('../utils/ApiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return ApiResponse.unauthorized(res, 'Authentication required');
    }

    if (!roles.includes(req.userRole)) {
      return ApiResponse.forbidden(res, 'You do not have permission to access this resource');
    }

    next();
  };
};

const authorizeSelfOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    try {
      if (req.userRole === 'admin') {
        return next();
      }

      const resourceUserId = await getResourceUserId(req);
      
      if (!resourceUserId) {
        return ApiResponse.notFound(res, 'Resource not found');
      }

      if (resourceUserId.toString() !== req.userId.toString()) {
        return ApiResponse.forbidden(res, 'You can only access your own resources');
      }

      next();
    } catch (error) {
      return ApiResponse.error(res, 500, 'Authorization error');
    }
  };
};

module.exports = { authorize, authorizeSelfOrAdmin };
