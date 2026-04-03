const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['support', 'merchant_mgmt', 'offer_mgmt', 'ad_mgmt', 'feedback'],
    required: true
  },
  permissions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

subAdminSchema.index({ userId: 1 });
subAdminSchema.index({ category: 1 });

module.exports = mongoose.model('SubAdmin', subAdminSchema);
