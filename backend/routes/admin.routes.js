const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/admin/dashboardController');
const staffController = require('../controllers/admin/staffController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All admin routes require authentication
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', dashboardController.getDashboard);

// Merchants
router.get('/merchants', dashboardController.getMerchants);
router.put('/merchants/:id', dashboardController.updateMerchant);

// Offers
router.get('/offers', dashboardController.getOffers);

// Ads
router.get('/ads', dashboardController.getAds);

// Users
router.get('/users', dashboardController.getUsers);

// Analytics
router.get('/analytics', dashboardController.getAnalytics);

// Staff management
router.get('/staff', staffController.getStaff);
router.post('/staff', staffController.createStaff);
router.put('/staff/:id', staffController.updateStaff);
router.delete('/staff/:id', staffController.deleteStaff);

module.exports = router;
