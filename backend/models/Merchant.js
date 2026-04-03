const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subCategory: String,
  description: String,
  address: String,
  phone: String,
  email: String,
  images: [String],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'verified'],
    default: 'pending'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'monthly', 'yearly'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  metrics: {
    totalRedemptions: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalOffers: { type: Number, default: 0 },
    activeOffers: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

merchantSchema.index({ userId: 1 });
merchantSchema.index({ category: 1, status: 1 });
merchantSchema.index({ status: 1 });

module.exports = mongoose.model('Merchant', merchantSchema);
