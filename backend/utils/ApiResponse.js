class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static created(res, data, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }

  static error(res, statusCode = 500, message = 'Internal Server Error', error = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? {
        code: error.code || 'ERROR',
        message: error.message || message,
        details: error.details || null
      } : null
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponse.error(res, 401, message, { code: 'AUTH_UNAUTHORIZED', message });
  }

  static forbidden(res, message = 'Forbidden') {
    return ApiResponse.error(res, 403, message, { code: 'ROLE_FORBIDDEN', message });
  }

  static notFound(res, message = 'Resource not found') {
    return ApiResponse.error(res, 404, message, { code: 'RESOURCE_NOT_FOUND', message });
  }

  static badRequest(res, message = 'Bad Request', error = null) {
    return ApiResponse.error(res, 400, message, error);
  }

  static tooManyRequests(res, message = 'Too many requests') {
    return ApiResponse.error(res, 429, message, { code: 'RATE_LIMIT_EXCEEDED', message });
  }
}

module.exports = ApiResponse;
