const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Redemption = require('../../../models/Redemption');
const Offer = require('../../../models/Offer');
const Merchant = require('../../../models/Merchant');
const User = require('../../../models/User');

const scanQR = AsyncHandler(async (req, res) => {
  const { qrToken, billAmount } = req.body;
  
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  // Find redemption by QR token
  const redemption = await Redemption.findOne({
    qrToken: qrToken,
    merchantId: merchant._id
  }).populate('offerId');

  if (!redemption) {
    return ApiResponse.badRequest(res, 'Invalid QR code or not for this merchant');
  }

  if (redemption.status !== 'claimed') {
    return ApiResponse.badRequest(res, 'This QR code has already been used');
  }

  // Get offer details for discount calculation
  const offer = redemption.offerId;
  
  let discount = 0;
  let savings = 0;

  if (offer) {
    if (offer.type === 'percent') {
      discount = (billAmount * offer.value) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else if (offer.type === 'flat') {
      discount = offer.value;
    } else if (offer.type === 'bogo') {
      // BOGO: half the bill
      discount = billAmount / 2;
    }
    
    savings = discount;
  }

  // Update redemption
  redemption.status = 'verified';
  redemption.billAmount = billAmount;
  redemption.discount = discount;
  redemption.savings = savings;
  redemption.redeemedAt = new Date();
  redemption.verifiedAt = new Date();
  
  await redemption.save();

  // Update user stats
  await User.findByIdAndUpdate(redemption.userId, {
    $inc: { 
      offersUsed: 1,
      totalSavings: savings
    }
  });

  // Update merchant metrics
  await Merchant.findByIdAndUpdate(merchant._id, {
    $inc: { 
      'metrics.totalRedemptions': 1,
      'metrics.totalRevenue': billAmount
    }
  });

  // Update offer stats
  await Offer.findByIdAndUpdate(offer._id, {
    $inc: { 
      usageCount: 1,
      'stats.redemptions': 1
    }
  });

  return ApiResponse.success(res, {
    success: true,
    redemptionId: redemption._id,
    billAmount,
    discount,
    savings,
    status: 'verified',
    message: 'Offer redeemed successfully!'
  }, 'Offer redeemed successfully');
});

const getRedemptions = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [redemptions, total] = await Promise.all([
    Redemption.find({ merchantId: merchant._id })
      .populate('userId', 'name phone')
      .populate('offerId', 'title type value')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Redemption.countDocuments({ merchantId: merchant._id })
  ]);

  const transformedRedemptions = redemptions.map(r => ({
    id: r._id,
    customerName: r.userId?.name || 'Unknown',
    customerPhone: r.userId?.phone || '',
    offerTitle: r.offerId?.title || 'Unknown',
    billAmount: r.billAmount,
    discount: r.discount,
    savings: r.savings,
    status: r.status,
    redeemedAt: r.redeemedAt,
    createdAt: r.createdAt
  }));

  return ApiResponse.success(res, {
    redemptions: transformedRedemptions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

module.exports = {
  scanQR,
  getRedemptions
};
