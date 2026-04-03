const express = require('express');
const router = express.Router();
const deskController = require('../controllers/subAdmin/deskController');
const approvalController = require('../controllers/subAdmin/approvalController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All sub-admin routes require authentication
router.use(authenticate);
router.use(authorize('sub_admin'));

// Desk
router.get('/desk', deskController.getDesk);

// Merchants
router.get('/merchants', approvalController.getPendingMerchants);
router.put('/merchants/:id', approvalController.approveMerchant);

// Offers
router.get('/offers', approvalController.getPendingOffers);
router.put('/offers/:id', approvalController.approveOffer);

// Ads
router.get('/ads', approvalController.getPendingAds);
router.put('/ads/:id', approvalController.approveAd);

// Tickets
router.get('/tickets', approvalController.getTickets);
router.put('/tickets/:id', approvalController.resolveTicket);

module.exports = router;
