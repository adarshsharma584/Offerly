const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'merchant', 'sub_admin', 'admin'],
    default: 'user'
  },
  avatar: String,
  location: {
    city: String,
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  coins: {
    type: Number,
    default: 0
  },
  offersUsed: {
    type: Number,
    default: 0
  },
  totalSavings: {
    type: Number,
    default: 0
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCode: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.index({ phone: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
