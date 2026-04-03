const jwt = require('jsonwebtoken');
const config = require('../config/env');

class AuthService {
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        role: user.role
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        type: 'refresh'
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
      return null;
    }
  }

  generateTokens(user) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    };
  }
}

module.exports = new AuthService();
