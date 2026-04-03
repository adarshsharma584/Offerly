const mongoose = require('mongoose');

const adCampaignSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['banner', 'featured', 'sponsored'],
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  spent: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'completed'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

adCampaignSchema.index({ merchantId: 1 });
adCampaignSchema.index({ status: 1 });

module.exports = mongoose.model('AdCampaign', adCampaignSchema);
