const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Redemption = require('../../../models/Redemption');
const Offer = require('../../../models/Offer');
const User = require('../../../models/User');
const qrService = require('../../../services/qrService');

const generateQR = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const redemption = await Redemption.findOne({
    _id: id,
    userId: req.userId
  }).populate('offerId');

  if (!redemption) {
    return ApiResponse.notFound(res, 'Redemption not found');
  }

  if (redemption.status !== 'claimed') {
    return ApiResponse.badRequest(res, 'QR code already generated');
  }

  // Generate QR token and data
  const { token, qrData } = await qrService.generateQRData(
    redemption._id,
    redemption.offerId._id,
    req.userId
  );

  // Generate QR code image
  const qrCode = await qrService.generateQRCode(qrData);

  // Update redemption with QR token
  redemption.qrToken = token;
  redemption.qrCode = qrCode;
  await redemption.save();

  return ApiResponse.success(res, {
    redemptionId: redemption._id,
    qrCode: qrCode,
    qrToken: token,
    offerTitle: redemption.offerId.title,
    status: 'ready'
  }, 'QR code generated successfully');
});

const getRedemptionHistory = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [redemptions, total] = await Promise.all([
    Redemption.find({ userId: req.userId })
      .populate('offerId', 'title type value category images')
      .populate('merchantId', 'businessName category rating images')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Redemption.countDocuments({ userId: req.userId })
  ]);

  const transformedRedemptions = redemptions.map(r => ({
    id: r._id,
    status: r.status,
    qrCode: r.qrCode,
    billAmount: r.billAmount,
    discount: r.discount,
    savings: r.savings,
    redeemedAt: r.redeemedAt,
    verifiedAt: r.verifiedAt,
    createdAt: r.createdAt,
    offer: r.offerId ? {
      id: r.offerId._id,
      title: r.offerId.title,
      type: r.offerId.type,
      value: r.offerId.value,
      category: r.offerId.category,
      images: r.offerId.images
    } : null,
    merchant: r.merchantId ? {
      id: r.merchantId._id,
      businessName: r.merchantId.businessName,
      category: r.merchantId.category,
      rating: r.merchantId.rating,
      image: r.merchantId.images?.[0]
    } : null
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

const getRedemptionStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const redemption = await Redemption.findOne({
    _id: id,
    userId: req.userId
  })
    .populate('offerId', 'title type value')
    .populate('merchantId', 'businessName');

  if (!redemption) {
    return ApiResponse.notFound(res, 'Redemption not found');
  }

  return ApiResponse.success(res, {
    id: redemption._id,
    status: redemption.status,
    qrCode: redemption.qrCode,
    qrToken: redemption.qrToken,
    billAmount: redemption.billAmount,
    discount: redemption.discount,
    savings: redemption.savings,
    offer: redemption.offerId,
    merchant: redemption.merchantId,
    verifiedAt: redemption.verifiedAt
  });
});

module.exports = {
  generateQR,
  getRedemptionHistory,
  getRedemptionStatus
};
