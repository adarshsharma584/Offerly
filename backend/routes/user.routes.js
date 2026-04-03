const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');
const offerController = require('../controllers/user/offerController');
const redemptionController = require('../controllers/user/redemptionController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { updateProfileSchema } = require('../utils/validators');

// Profile routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.get('/dashboard', authenticate, userController.getDashboard);

// Offer routes
router.get('/offers', offerController.getOffers);
router.get('/offers/categories', offerController.getCategories);
router.get('/offers/my', authenticate, offerController.getMyOffers);
router.get('/offers/:id', offerController.getOfferById);
router.post('/offers/:id/claim', authenticate, offerController.claimOffer);

// Redemption routes
router.post('/redemptions/:id/generate-qr', authenticate, redemptionController.generateQR);
router.get('/redemptions/history', authenticate, redemptionController.getRedemptionHistory);
router.get('/redemptions/:id/status', authenticate, redemptionController.getRedemptionStatus);

module.exports = router;
