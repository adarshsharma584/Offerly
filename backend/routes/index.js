const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const merchantRoutes = require('./merchant.routes');
const subAdminRoutes = require('./subAdmin.routes');
const adminRoutes = require('./admin.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Offerly API is running', timestamp: new Date() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/merchant', merchantRoutes);
router.use('/subadmin', subAdminRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
