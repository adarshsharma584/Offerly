const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Merchant = require('../../../models/Merchant');
const Offer = require('../../../models/Offer');
const User = require('../../../models/User');
const Redemption = require('../../../models/Redemption');
const AdCampaign = require('../../../models/AdCampaign');
const Ticket = require('../../../models/Ticket');

const getDashboard = AsyncHandler(async (req, res) => {
  const [
    totalMerchants,
    totalUsers,
    totalOffers,
    totalRedemptions,
    pendingMerchants,
    pendingOffers,
    pendingAds
  ] = await Promise.all([
    Merchant.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Offer.countDocuments(),
    Redemption.countDocuments(),
    Merchant.countDocuments({ status: 'pending' }),
    Offer.countDocuments({ status: 'pending' }),
    AdCampaign.countDocuments({ status: 'pending' })
  ]);

  // Calculate total revenue
  const redemptions = await Redemption.find();
  const totalRevenue = redemptions.reduce((sum, r) => sum + (r.billAmount || 0), 0);
  const totalSavings = redemptions.reduce((sum, r) => sum + (r.savings || 0), 0);

  return ApiResponse.success(res, {
    totalMerchants,
    totalUsers,
    totalOffers,
    totalRedemptions,
    pendingMerchants,
    pendingOffers,
    pendingAds,
    totalRevenue,
    totalSavings,
    commission: totalRevenue * 0.12
  });
});

const getMerchants = AsyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [merchants, total] = await Promise.all([
    Merchant.find(query)
      .populate('userId', 'name phone email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Merchant.countDocuments(query)
  ]);

  return ApiResponse.success(res, {
    merchants,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

const updateMerchant = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const merchant = await Merchant.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  return ApiResponse.success(res, merchant, 'Merchant updated successfully');
});

const getOffers = AsyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 20 } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [offers, total] = await Promise.all([
    Offer.find(query)
      .populate('merchantId', 'businessName category')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Offer.countDocuments(query)
  ]);

  return ApiResponse.success(res, {
    offers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

const getAds = AsyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const query = {};
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [ads, total] = await Promise.all([
    AdCampaign.find(query)
      .populate('merchantId', 'businessName')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    AdCampaign.countDocuments(query)
  ]);

  return ApiResponse.success(res, {
    ads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

const getUsers = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find({ role: 'user' })
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments({ role: 'user' })
  ]);

  return ApiResponse.success(res, {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

const getAnalytics = AsyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    recentRedemptions,
    recentUsers,
    recentMerchants
  ] = await Promise.all([
    Redemption.find({ createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ role: 'user', createdAt: { $gte: thirtyDaysAgo } }),
    Merchant.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
  ]);

  const revenueByDay = {};
  recentRedemptions.forEach(r => {
    const day = r.createdAt.toISOString().split('T')[0];
    revenueByDay[day] = (revenueByDay[day] || 0) + (r.billAmount || 0);
  });

  return ApiResponse.success(res, {
    newUsersLast30Days: recentUsers,
    newMerchantsLast30Days: recentMerchants,
    revenueByDay,
    totalRedemptions: recentRedemptions.length
  });
});

module.exports = {
  getDashboard,
  getMerchants,
  updateMerchant,
  getOffers,
  getAds,
  getUsers,
  getAnalytics
};
