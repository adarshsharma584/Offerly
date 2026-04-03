const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['percent', 'flat', 'bogo', 'cashback'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: Number,
  category: {
    type: String,
    required: true,
    index: true
  },
  images: [String],
  terms: [String],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  usageLimit: Number,
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'expired'],
    default: 'pending'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAd: {
    type: Boolean,
    default: false
  },
  redemptionCode: String,
  stats: {
    views: { type: Number, default: 0 },
    claims: { type: Number, default: 0 },
    redemptions: { type: Number, default: 0 }
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date
}, {
  timestamps: true
});

offerSchema.index({ merchantId: 1, status: 1 });
offerSchema.index({ category: 1, status: 1 });
offerSchema.index({ status: 1, endDate: 1 });
offerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Offer', offerSchema);
