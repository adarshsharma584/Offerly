const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const otpService = require('../../../services/otpService');
const authService = require('../../../services/authService');
const User = require('../../../models/User');
const Merchant = require('../../../models/Merchant');
const SubAdmin = require('../../../models/SubAdmin');

const sendOTP = AsyncHandler(async (req, res) => {
  const { phone } = req.body;
  
  await otpService.sendOTP(phone);
  
  return ApiResponse.success(res, {
    message: 'OTP sent successfully',
    phone: phone.slice(0, 3) + '****' + phone.slice(-3)
  }, 'OTP sent to your phone');
});

const verifyOTP = AsyncHandler(async (req, res) => {
  const { phone, otp, role } = req.body;
  
  const result = await otpService.verifyOTP(phone, otp);
  
  if (!result.valid) {
    return ApiResponse.badRequest(res, result.error, {
      code: 'AUTH_INVALID_OTP',
      message: result.error
    });
  }

  // Find or create user based on role
  let user = await User.findOne({ phone });
  
  if (!user) {
    user = new User({
      name: 'User',
      phone,
      role: role || 'user'
    });
    await user.save();
  } else {
    // Update role if different
    if (role && user.role !== role) {
      user.role = role;
      await user.save();
    }
  }

  // Generate tokens
  const tokens = authService.generateTokens(user);
  
  // Return user data (without sensitive info)
  const userData = {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    location: user.location,
    coins: user.coins,
    offersUsed: user.offersUsed,
    totalSavings: user.totalSavings,
    subscriptionPlan: null,
    businessName: null,
    isVerified: false,
    subAdminCategory: null
  };

  // If merchant, get merchant data
  if (user.role === 'merchant') {
    const merchant = await Merchant.findOne({ userId: user._id });
    if (merchant) {
      userData.businessName = merchant.businessName;
      userData.category = merchant.category;
      userData.isVerified = merchant.isVerified;
      userData.subscriptionPlan = merchant.subscription.plan;
    }
  }

  // If sub_admin, get category
  if (user.role === 'sub_admin') {
    const subAdmin = await SubAdmin.findOne({ userId: user._id });
    if (subAdmin) {
      userData.subAdminCategory = subAdmin.category;
    }
  }

  return ApiResponse.success(res, {
    user: userData,
    ...tokens
  }, 'Login successful');
});

const logout = AsyncHandler(async (req, res) => {
  // In a real app, you might want to blacklist the token
  return ApiResponse.success(res, null, 'Logged out successfully');
});

const getMe = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  const userData = {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    location: user.location,
    coins: user.coins,
    offersUsed: user.offersUsed,
    totalSavings: user.totalSavings,
    subscriptionPlan: null,
    businessName: null,
    isVerified: false,
    subAdminCategory: null
  };

  if (user.role === 'merchant') {
    const merchant = await Merchant.findOne({ userId: user._id });
    if (merchant) {
      userData.businessName = merchant.businessName;
      userData.category = merchant.category;
      userData.isVerified = merchant.isVerified;
      userData.subscriptionPlan = merchant.subscription.plan;
    }
  }

  if (user.role === 'sub_admin') {
    const subAdmin = await SubAdmin.findOne({ userId: user._id });
    if (subAdmin) {
      userData.subAdminCategory = subAdmin.category;
    }
  }

  return ApiResponse.success(res, userData);
});

const refreshToken = AsyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return ApiResponse.badRequest(res, 'Refresh token required');
  }

  const decoded = authService.verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.userId);
  
  if (!user) {
    return ApiResponse.unauthorized(res, 'User not found');
  }

  const tokens = authService.generateTokens(user);
  
  return ApiResponse.success(res, tokens);
});

module.exports = {
  sendOTP,
  verifyOTP,
  logout,
  getMe,
  refreshToken
};
