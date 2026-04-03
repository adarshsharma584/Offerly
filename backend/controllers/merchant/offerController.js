const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Offer = require('../../../models/Offer');
const Merchant = require('../../../models/Merchant');

const createOffer = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const {
    title,
    description,
    type,
    value,
    minPurchase,
    maxDiscount,
    category,
    images,
    terms,
    startDate,
    endDate,
    usageLimit,
    perUserLimit
  } = req.body;

  const offer = new Offer({
    merchantId: merchant._id,
    title,
    description,
    type,
    value,
    minPurchase,
    maxDiscount,
    category: category || merchant.category,
    images,
    terms,
    startDate: startDate || Date.now(),
    endDate,
    usageLimit,
    perUserLimit: perUserLimit || 1,
    status: 'pending' // All offers need approval
  });

  await offer.save();

  // Update merchant metrics
  await Merchant.findByIdAndUpdate(merchant._id, {
    $inc: { 'metrics.totalOffers': 1 }
  });

  return ApiResponse.created(res, offer, 'Offer created successfully');
});

const getMyOffers = AsyncHandler(async (req, res) => {
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

  const [offers, total] = await Promise.all([
    Offer.find(query)
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

const updateOffer = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { id } = req.params;
  
  const offer = await Offer.findOne({ _id: id, merchantId: merchant._id });
  
  if (!offer) {
    return ApiResponse.notFound(res, 'Offer not found');
  }

  const updates = req.body;
  delete updates.merchantId; // Prevent changing merchant
  
  const updatedOffer = await Offer.findByIdAndUpdate(
    id,
    { ...updates, status: 'pending' }, // Re-approve on update
    { new: true, runValidators: true }
  );

  return ApiResponse.success(res, updatedOffer, 'Offer updated successfully');
});

const deleteOffer = AsyncHandler(async (req, res) => {
  const merchant = await Merchant.findOne({ userId: req.userId });
  
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  const { id } = req.params;
  
  const offer = await Offer.findOneAndDelete({ _id: id, merchantId: merchant._id });
  
  if (!offer) {
    return ApiResponse.notFound(res, 'Offer not found');
  }

  // Update merchant metrics
  await Merchant.findByIdAndUpdate(merchant._id, {
    $inc: { 'metrics.totalOffers': -1 }
  });

  return ApiResponse.success(res, null, 'Offer deleted successfully');
});

module.exports = {
  createOffer,
  getMyOffers,
  updateOffer,
  deleteOffer
};
