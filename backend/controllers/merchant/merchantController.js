const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Merchant = require('../../../models/Merchant');
const Offer = require('../../../models/Offer');
const Redemption = require('../../../models/Redemption');

const getProfile = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId })
    .populate('userId', 'name phone email avatar location');

  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant profile not found');
  }

  return ApiResponse.success(res, merchant);
});

const updateProfile = AsyncHandler(async (req, res) => {
  const { businessName, category, subCategory, description, address, phone, email, images } = req.body;

  const merchant = await Merchant.findOneAndUpdate(
    { userId: req.userId },
    { businessName, category, subCategory, description, address, phone, email, images },
    { new: true, runValidators: true }
  );

  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant profile not found');
  }

  return ApiResponse.success(res, merchant, 'Profile updated successfully');
});

const registerMerchant = AsyncHandler(async (req, res) => {
  const { businessName, category, subCategory, description, address, phone, email } = req.body;

  // Check if merchant already exists
  const existingMerchant = await Merchant.findOne({ userId: req.userId });
  if (existingMerchant) {
    return ApiResponse.badRequest(res, 'Merchant already registered');
  }

  const merchant = new Merchant({
    userId: req.userId,
    businessName,
    category,
    subCategory,
    description,
    address,
    phone,
    email,
    status: 'pending'
  });

  await merchant.save();

  return ApiResponse.created(res, merchant, 'Merchant registered successfully');
});

const getDashboard = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const redemptions = await Redemption.find({ merchantId: merchant._id });
  
  const totalRevenue = redemptions.reduce((sum, r) => sum + (r.billAmount || 0), 0);
  const totalSavings = redemptions.reduce((sum, r) => sum + (r.savings || 0), 0);
  
  const offers = await Offer.find({ merchantId: merchant._id });
  const activeOffers = offers.filter(o => o.status === 'active').length;

  return ApiResponse.success(res, {
    totalRevenue,
    totalRedemptions: redemptions.length,
    activeOffers,
    avgBillValue: redemptions.length > 0 ? Math.round(totalRevenue / redemptions.length) : 0,
    recentRedemptions: redemptions.slice(0, 10)
  });
});

module.exports = {
  getProfile,
  updateProfile,
  registerMerchant,
  getDashboard
};
