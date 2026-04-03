const Joi = require('joi');

const sendOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone must be a valid 10-digit number'
  })
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers'
  }),
  role: Joi.string().valid('user', 'merchant', 'admin', 'sub_admin').default('user')
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  avatar: Joi.string().uri().allow(null, ''),
  location: Joi.object({
    city: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2)
  })
});

const createOfferSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  type: Joi.string().valid('percent', 'flat', 'bogo', 'cashback').required(),
  value: Joi.number().min(1).required(),
  minPurchase: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0),
  category: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
  terms: Joi.array().items(Joi.string()),
  startDate: Joi.date().default(Date.now()),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  usageLimit: Joi.number().min(1),
  perUserLimit: Joi.number().min(1).default(1)
});

const createMerchantSchema = Joi.object({
  businessName: Joi.string().min(2).max(100).required(),
  category: Joi.string().required(),
  subCategory: Joi.string(),
  description: Joi.string().max(500),
  address: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  email: Joi.string().email()
});

const scanQRSchema = Joi.object({
  qrToken: Joi.string().required(),
  billAmount: Joi.number().min(0).required()
});

const createTicketSchema = Joi.object({
  subject: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(1000).required(),
  type: Joi.string().valid('complaint', 'query', 'feedback', 'bug').default('query'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('-createdAt')
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
  updateProfileSchema,
  createOfferSchema,
  createMerchantSchema,
  scanQRSchema,
  createTicketSchema,
  paginationSchema
};
