const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const User = require('../../../models/User');

const getProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, user);
});

const updateProfile = AsyncHandler(async (req, res) => {
  const { name, email, avatar, location } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, email, avatar, location },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, user, 'Profile updated successfully');
});

const getDashboard = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }

  return ApiResponse.success(res, {
    name: user.name,
    coins: user.coins,
    offersUsed: user.offersUsed,
    totalSavings: user.totalSavings,
    referralCode: user.referralCode
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboard
};
