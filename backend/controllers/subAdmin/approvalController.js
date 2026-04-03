const ApiResponse = require('../../../utils/ApiResponse');
const AsyncHandler = require('../../../utils/AsyncHandler');
const Merchant = require('../../../models/Merchant');
const Offer = require('../../../models/Offer');
const AdCampaign = require('../../../models/AdCampaign');
const Ticket = require('../../../models/Ticket');
const SubAdmin = require('../../../models/SubAdmin');

const getPendingMerchants = AsyncHandler(async (req, res) => {
  const merchants = await Merchant.find({ status: 'pending' })
    .populate('userId', 'name phone email')
    .sort('-createdAt');

  return ApiResponse.success(res, merchants);
});

const approveMerchant = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  
  const merchant = await Merchant.findById(id);
  if (!merchant) {
    return ApiResponse.notFound(res, 'Merchant not found');
  }

  merchant.status = action === 'approve' ? 'verified' : 'rejected';
  merchant.isVerified = action === 'approve';
  await merchant.save();

  return ApiResponse.success(res, merchant, `Merchant ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
});

const getPendingOffers = AsyncHandler(async (req, res) => {
  const offers = await Offer.find({ status: 'pending' })
    .populate('merchantId', 'businessName category')
    .sort('-createdAt');

  return ApiResponse.success(res, offers);
});

const approveOffer = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  
  const offer = await Offer.findById(id);
  if (!offer) {
    return ApiResponse.notFound(res, 'Offer not found');
  }

  offer.status = action === 'approve' ? 'active' : 'rejected';
  if (action === 'approve') {
    offer.approvedBy = req.userId;
    offer.approvedAt = new Date();
  }
  await offer.save();

  // Update merchant active offers count
  if (action === 'approve') {
    await Merchant.findByIdAndUpdate(offer.merchantId, {
      $inc: { 'metrics.activeOffers': 1 }
    });
  }

  return ApiResponse.success(res, offer, `Offer ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
});

const getPendingAds = AsyncHandler(async (req, res) => {
  const ads = await AdCampaign.find({ status: 'pending' })
    .populate('merchantId', 'businessName')
    .sort('-createdAt');

  return ApiResponse.success(res, ads);
});

const approveAd = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  
  const ad = await AdCampaign.findById(id);
  if (!ad) {
    return ApiResponse.notFound(res, 'Ad campaign not found');
  }

  ad.status = action === 'approve' ? 'active' : 'rejected';
  if (action === 'approve') {
    ad.approvedBy = req.userId;
  }
  await ad.save();

  return ApiResponse.success(res, ad, `Ad campaign ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
});

const getTickets = AsyncHandler(async (req, res) => {
  const { status } = req.query;
  
  const query = {};
  if (status) {
    query.status = status;
  }

  const tickets = await Ticket.find(query)
    .populate('userId', 'name phone')
    .sort('-createdAt');

  return ApiResponse.success(res, tickets);
});

const resolveTicket = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return ApiResponse.notFound(res, 'Ticket not found');
  }

  ticket.status = 'resolved';
  ticket.responses.push({
    from: req.userId,
    message: response,
    createdAt: new Date()
  });
  await ticket.save();

  return ApiResponse.success(res, ticket, 'Ticket resolved successfully');
});

module.exports = {
  getPendingMerchants,
  approveMerchant,
  getPendingOffers,
  approveOffer,
  getPendingAds,
  approveAd,
  getTickets,
  resolveTicket
};
