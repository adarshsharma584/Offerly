const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Offer = require('../../../models/Offer');
const Merchant = require('../../../models/Merchant');
const Redemption = require('../../../models/Redemption');

const getOffers = AsyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  
  const query = { status: 'active' };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [offers, total] = await Promise.all([
    Offer.find(query)
      .populate('merchantId', 'businessName category rating images address')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Offer.countDocuments(query)
  ]);

  // Transform to match frontend expectations
  const transformedOffers = offers.map(offer => ({
    id: offer._id,
    title: offer.title,
    description: offer.description,
    type: offer.type,
    value: offer.value,
    minPurchase: offer.minPurchase,
    maxDiscount: offer.maxDiscount,
    category: offer.category,
    images: offer.images,
    terms: offer.terms,
    startDate: offer.startDate,
    endDate: offer.endDate,
    usageLimit: offer.usageLimit,
    usageCount: offer.usageCount,
    isFeatured: offer.isFeatured,
    merchant: offer.merchantId ? {
      id: offer.merchantId._id,
      businessName: offer.merchantId.businessName,
      category: offer.merchantId.category,
      rating: offer.merchantId.rating,
      image: offer.merchantId.images?.[0],
      address: offer.merchantId.address
    } : null
  }));

  return ApiResponse.success(res, {
    offers: transformedOffers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

const getOfferById = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const offer = await Offer.findById(id)
    .populate('merchantId', 'businessName category rating images address phone email')
    .lean();

  if (!offer) {
    return ApiResponse.notFound(res, 'Offer not found');
  }

  // Increment view count
  await Offer.findByIdAndUpdate(id, { $inc: { 'stats.views': 1 } });

  const transformedOffer = {
    id: offer._id,
    title: offer.title,
    description: offer.description,
    type: offer.type,
    value: offer.value,
    minPurchase: offer.minPurchase,
    maxDiscount: offer.maxDiscount,
    category: offer.category,
    images: offer.images,
    terms: offer.terms,
    startDate: offer.startDate,
    endDate: offer.endDate,
    usageLimit: offer.usageLimit,
    usageCount: offer.usageCount,
    stats: offer.stats,
    merchant: offer.merchantId ? {
      id: offer.merchantId._id,
      businessName: offer.merchantId.businessName,
      category: offer.merchantId.category,
      rating: offer.merchantId.rating,
      image: offer.merchantId.images?.[0],
      address: offer.merchantId.address,
      phone: offer.merchantId.phone,
      email: offer.merchantId.email
    } : null
  };

  return ApiResponse.success(res, transformedOffer);
});

const claimOffer = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const offer = await Offer.findById(id);
  
  if (!offer) {
    return ApiResponse.notFound(res, 'Offer not found');
  }

  if (offer.status !== 'active') {
    return ApiResponse.badRequest(res, 'This offer is not available');
  }

  // Check if user has already claimed this offer
  const existingClaim = await Redemption.findOne({
    userId: req.userId,
    offerId: id
  });

  if (existingClaim) {
    return ApiResponse.badRequest(res, 'You have already claimed this offer');
  }

  // Check usage limit
  if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
    return ApiResponse.badRequest(res, 'This offer has reached its usage limit');
  }

  // Create redemption record
  const redemption = new Redemption({
    userId: req.userId,
    offerId: id,
    merchantId: offer.merchantId,
    status: 'claimed'
  });

  await redemption.save();

  // Update offer claim count
  await Offer.findByIdAndUpdate(id, { $inc: { 'stats.claims': 1 } });

  return ApiResponse.success(res, {
    redemptionId: redemption._id,
    status: 'claimed',
    message: 'Offer claimed successfully'
  }, 'Offer claimed successfully');
});

const getMyOffers = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [redemptions, total] = await Promise.all([
    Redemption.find({ userId: req.userId })
      .populate('offerId')
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
    qrToken: r.qrToken,
    billAmount: r.billAmount,
    discount: r.discount,
    savings: r.savings,
    redeemedAt: r.redeemedAt,
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

const getCategories = AsyncHandler(async (req, res) => {
  const categories = [
    { id: 'food', label: 'Food', icon: 'utensils' },
    { id: 'saloon', label: 'Saloon', icon: 'scissors' },
    { id: 'shops', label: 'Shops', icon: 'store' },
    { id: 'gym', label: 'Gym', icon: 'dumbbell' },
    { id: 'services', label: 'Services', icon: 'wrench' },
    { id: 'more', label: 'More', icon: 'plus' }
  ];

  return ApiResponse.success(res, categories);
});

module.exports = {
  getOffers,
  getOfferById,
  claimOffer,
  getMyOffers,
  getCategories
};
