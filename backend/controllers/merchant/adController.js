const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const AdCampaign = require('../../../models/AdCampaign');
const Merchant = require('../../../models/Merchant');

const createAd = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { title, type, budget, startDate, endDate } = req.body;

  const ad = new AdCampaign({
    merchantId: merchant._id,
    title,
    type,
    budget,
    startDate: startDate || Date.now(),
    endDate,
    status: 'pending'
  });

  await ad.save();

  return ApiResponse.created(res, ad, 'Ad campaign created successfully');
});

const getMyAds = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { status, page = 1, limit = 20 } = req.query;
  
  const query = { merchantId: merchant._id };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [ads, total] = await Promise.all([
    AdCampaign.find(query)
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

const updateAd = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { id } = req.params;
  
  const ad = await AdCampaign.findOne({ _id: id, merchantId: merchant._id });
  
  if (!ad) {
    return ApiResponse.notFound(res, 'Ad campaign not found');
  }

  const updates = req.body;
  delete updates.merchantId;
  delete updates.spent;
  delete updates.impressions;
  delete updates.clicks;

  const updatedAd = await AdCampaign.findByIdAndUpdate(
    id,
    { ...updates, status: 'pending' },
    { new: true, runValidators: true }
  );

  return ApiResponse.success(res, updatedAd, 'Ad campaign updated successfully');
});

const deleteAd = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { id } = req.params;
  
  const ad = await AdCampaign.findOneAndDelete({ _id: id, merchantId: merchant._id });
  
  if (!ad) {
    return ApiResponse.notFound(res, 'Ad campaign not found');
  }

  return ApiResponse.success(res, null, 'Ad campaign deleted successfully');
});

module.exports = {
  createAd,
  getMyAds,
  updateAd,
  deleteAd
};
