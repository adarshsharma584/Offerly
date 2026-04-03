const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchant/merchantController');
const offerController = require('../controllers/merchant/offerController');
const adController = require('../controllers/merchant/adController');
const scanController = require('../controllers/merchant/scanController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validation');
const { scanLimiter } = require('../middleware/rateLimit');
const { createOfferSchema, createMerchantSchema, createAdSchema, scanQRSchema } = require('../utils/validators');

// All merchant routes require authentication
router.use(authenticate);
router.use(authorize('merchant'));

// Merchant profile
router.post('/register', validate(createMerchantSchema), merchantController.registerMerchant);
router.get('/profile', merchantController.getProfile);
router.put('/profile', merchantController.updateProfile);
router.get('/dashboard', merchantController.getDashboard);

// Offers
router.post('/offers', validate(createOfferSchema), offerController.createOffer);
router.get('/offers', offerController.getMyOffers);
router.put('/offers/:id', offerController.updateOffer);
router.delete('/offers/:id', offerController.deleteOffer);

// Ads
router.post('/ads', adController.createAd);
router.get('/ads', adController.getMyAds);
router.put('/ads/:id', adController.updateAd);
router.delete('/ads/:id', adController.deleteAd);

// QR Scanning
router.post('/scan', scanLimiter, validate(scanQRSchema), scanController.scanQR);
router.get('/redemptions', scanController.getRedemptions);

module.exports = router;
