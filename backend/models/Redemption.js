const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
    index: true
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true
  },
  qrCode: String,
  qrToken: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['claimed', 'verified', 'completed', 'cancelled'],
    default: 'claimed'
  },
  billAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  savings: {
    type: Number,
    default: 0
  },
  redeemedAt: Date,
  verifiedAt: Date
}, {
  timestamps: true
});

redemptionSchema.index({ userId: 1, status: 1 });
redemptionSchema.index({ merchantId: 1, createdAt: -1 });
redemptionSchema.index({ qrToken: 1 });

module.exports = mongoose.model('Redemption', redemptionSchema);
