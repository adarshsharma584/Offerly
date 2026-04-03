# Offerly Backend - MERN Stack Implementation Plan

## 1. Project Overview

**Project:** Offerly - Local Discovery SaaS Platform  
**Tech Stack:** MongoDB + Express.js + React + Node.js (MERN)  
**Architecture:** REST API with JWT Authentication  
**OTP:** Mock mode (123456 for development)

---

## 2. Project Structure

```
offerly-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── redis.ts             # Redis (optional, for caching)
│   │   └── env.ts               # Environment variables
│   │
│   ├── models/                   # MongoDB Schemas
│   │   ├── User.ts
│   │   ├── Merchant.ts
│   │   ├── SubAdmin.ts
│   │   ├── Admin.ts
│   │   ├── Offer.ts
│   │   ├── AdCampaign.ts
│   │   ├── Redemption.ts
│   │   ├── Category.ts
│   │   ├── Ticket.ts
│   │   ├── OTP.ts
│   │   └── Subscription.ts
│   │
│   ├── controllers/              # Business Logic
│   │   ├── auth/
│   │   │   ├── authController.ts
│   │   │   ├── otpController.ts
│   │   │   └── roleController.ts
│   │   ├── user/
│   │   │   ├── userController.ts
│   │   │   ├── offerController.ts
│   │   │   └── redemptionController.ts
│   │   ├── merchant/
│   │   │   ├── merchantController.ts
│   │   │   ├── offerController.ts
│   │   │   ├── adController.ts
│   │   │   └── scanController.ts
│   │   ├── subAdmin/
│   │   │   ├── deskController.ts
│   │   │   └── approvalController.ts
│   │   └── admin/
│   │       ├── dashboardController.ts
│   │       ├── analyticsController.ts
│   │       └── staffController.ts
│   │
│   ├── routes/                   # API Routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── merchant.routes.ts
│   │   ├── subAdmin.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── role.middleware.ts    # Role-based access
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── otpService.ts         # Mock OTP service
│   │   ├── emailService.ts       # For notifications
│   │   ├── cacheService.ts
│   │   └── qrService.ts         # QR code generation/validation
│   │
│   ├── utils/
│   │   ├── ApiResponse.ts        # Standardized responses
│   │   ├── AsyncHandler.ts       # Try-catch wrapper
│   │   ├── validators/           # Zod schemas
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   └── app.ts                    # Express app setup
│
├── tests/
├── .env.example
├── package.json
└── server.ts                     # Entry point
```

---

## 3. Database Schema Design

### 3.1 User Model
```typescript
{
  _id: ObjectId,
  name: String,
  phone: String (unique, indexed),
  email: String (unique),
  password: String (hashed),
  role: Enum['user', 'merchant', 'sub_admin', 'admin'],
  avatar: String,
  location: {
    city: String,
    coordinates: [Number] // [lat, lng]
  },
  coins: Number (default: 0),
  offersUsed: Number,
  totalSavings: Number,
  referredBy: ObjectId (ref: User),
  referralCode: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 Merchant Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  businessName: String,
  category: String (indexed),
  subCategory: String,
  description: String,
  address: String,
  phone: String,
  email: String,
  images: [String],
  rating: Number,
  totalReviews: Number,
  isVerified: Boolean (default: false),
  status: Enum['pending', 'approved', 'rejected', 'verified'],
  subscription: {
    plan: Enum['free', 'monthly', 'yearly'],
    startDate: Date,
    endDate: Date,
    isActive: Boolean
  },
  metrics: {
    totalRedemptions: Number,
    totalRevenue: Number,
    totalOffers: Number,
    activeOffers: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 Offer Model
```typescript
{
  _id: ObjectId,
  merchantId: ObjectId (ref: Merchant, indexed),
  title: String,
  description: String,
  type: Enum['percent', 'flat', 'bogo', 'cashback'],
  value: Number,
  minPurchase: Number,
  maxDiscount: Number,
  category: String (indexed),
  images: [String],
  terms: [String],
  startDate: Date,
  endDate: Date,
  usageLimit: Number,
  usageCount: Number,
  perUserLimit: Number,
  status: Enum['pending', 'active', 'rejected', 'expired'],
  isFeatured: Boolean,
  isAd: Boolean,
  redemptionCode: String,
  stats: { views: Number, claims: Number, redemptions: Number },
  approvedBy: ObjectId,
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 AdCampaign Model
```typescript
{
  _id: ObjectId,
  merchantId: ObjectId,
  title: String,
  type: Enum['banner', 'featured', 'sponsored'],
  budget: Number,
  spent: Number,
  impressions: Number,
  clicks: Number,
  startDate: Date,
  endDate: Date,
  status: Enum['pending', 'active', 'paused', 'completed'],
  approvedBy: ObjectId,
  createdAt: Date
}
```

### 3.5 Redemption Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  offerId: ObjectId (indexed),
  merchantId: ObjectId (indexed),
  qrCode: String,
  qrToken: String,
  status: Enum['claimed', 'verified', 'completed', 'cancelled'],
  billAmount: Number,
  discount: Number,
  savings: Number,
  redeemedAt: Date,
  verifiedAt: Date,
  createdAt: Date
}
```

### 3.6 SubAdmin Model
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  category: Enum['support', 'merchant_mgmt', 'offer_mgmt', 'ad_mgmt', 'feedback'],
  permissions: [String],
  isActive: Boolean,
  assignedAt: Date,
  createdBy: ObjectId
}
```

### 3.7 Ticket Model (Support)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  subject: String,
  message: String,
  type: Enum['complaint', 'query', 'feedback', 'bug'],
  status: Enum['open', 'pending', 'resolved', 'closed'],
  priority: Enum['low', 'medium', 'high', 'urgent'],
  assignedTo: ObjectId,
  responses: [{ from: ObjectId, message: String, createdAt: Date }],
  createdAt: Date,
  updatedAt: Date
}
```

### 3.8 OTP Model
```typescript
{
  _id: ObjectId,
  phone: String (indexed),
  otp: String,
  attempts: Number (default: 0),
  expiresAt: Date (indexed),
  verified: Boolean,
  createdAt: Date
}
```

---

## 4. API Endpoints

### 4.1 Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP & login |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh-token` | Refresh JWT |
| GET | `/api/auth/me` | Get current user |

### 4.2 User APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/offers` | Browse offers |
| GET | `/api/offers/:id` | Offer details |
| POST | `/api/offers/:id/claim` | Claim offer |
| GET | `/api/offers/my` | My claimed offers |
| POST | `/api/redemptions/:id/generate-qr` | Generate QR |
| GET | `/api/redemptions/history` | Redemption history |

### 4.3 Merchant APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/merchant/register` | Register merchant |
| GET | `/api/merchant/profile` | Get merchant profile |
| PUT | `/api/merchant/profile` | Update profile |
| GET | `/api/merchant/dashboard` | Dashboard stats |
| POST | `/api/merchant/offers` | Create offer |
| GET | `/api/merchant/offers` | List my offers |
| PUT | `/api/merchant/offers/:id` | Update offer |
| DELETE | `/api/merchant/offers/:id` | Delete offer |
| GET | `/api/merchant/redemptions` | My redemptions |
| POST | `/api/merchant/scan` | Scan & verify QR |
| GET | `/api/merchant/ads` | My ad campaigns |
| POST | `/api/merchant/ads` | Create ad campaign |
| GET | `/api/merchant/subscription` | Subscription details |
| POST | `/api/merchant/subscription` | Choose plan |

### 4.4 Sub-Admin APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subadmin/desk` | Get assigned desk | SubAdmin |
| GET | `/api/subadmin/merchants` | Pending merchants | merchant_mgmt |
| PUT | `/api/subadmin/merchants/:id` | Approve/reject | merchant_mgmt |
| GET | `/api/subadmin/offers` | Pending offers | offer_mgmt |
| PUT | `/api/subadmin/offers/:id` | Approve/reject | offer_mgmt |
| GET | `/api/subadmin/ads` | Pending ads | ad_mgmt |
| PUT | `/api/subadmin/ads/:id` | Approve/reject | ad_mgmt |
| GET | `/api/subadmin/tickets` | Support tickets | support |
| PUT | `/api/subadmin/tickets/:id` | Resolve ticket | support |

### 4.5 Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Global dashboard |
| GET | `/api/admin/merchants` | All merchants |
| PUT | `/api/admin/merchants/:id` | Update merchant |
| GET | `/api/admin/offers` | All offers |
| GET | `/api/admin/ads` | All ads |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/subscriptions` | Subscription analytics |
| GET | `/api/admin/analytics` | Detailed analytics |
| GET | `/api/admin/staff` | List sub-admins |
| POST | `/api/admin/staff` | Create sub-admin |
| PUT | `/api/admin/staff/:id` | Update sub-admin |
| DELETE | `/api/admin/staff/:id` | Remove sub-admin |

---

## 5. Security Implementation

### JWT Strategy
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Token stored in httpOnly cookie

### Rate Limiting
- Global: 100 requests/minute
- Auth endpoints: 5 requests/minute
- Scan endpoint: 10 requests/minute

---

## 6. Performance Optimizations

### Database Indexing
```javascript
{ phone: 1 }
{ merchantId: 1, status: 1 }
{ category: 1, status: 1 }
{ createdAt: -1 }
{ status: 1, expiresAt: 1 }
```

### Caching (Redis)
- Popular offers: 5 min TTL
- Categories: 1 hour TTL
- Dashboard stats: 1 min TTL
- User profile: 5 min TTL

### Query Optimization
- Select only needed fields
- Pagination (default 20, max 100)
- Lean queries for reads
- Aggregation pipelines for analytics

---

## 7. OTP Implementation (Mock Mode)

```typescript
class OTPService {
  private readonly MOCK_OTP = '123456';
  private readonly OTP_EXPIRY = 5 * 60 * 1000;
  
  async sendOTP(phone: string): Promise<boolean> {
    console.log(`[DEV] OTP for ${phone}: ${this.MOCK_OTP}`);
    return true;
  }
  
  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    return otp === this.MOCK_OTP;
  }
}
```

---

## 8. Error Handling

### Standard Response
```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human readable message',
    details: {}
  }
}
```

### Error Codes
- AUTH_INVALID_OTP
- AUTH_OTP_EXPIRED
- AUTH_UNAUTHORIZED
- ROLE_FORBIDDEN
- VALIDATION_ERROR
- RESOURCE_NOT_FOUND
- RATE_LIMIT_EXCEEDED

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1)
- Project setup with Express + TypeScript
- MongoDB connection + Mongoose
- Environment configuration
- Basic middleware (auth, error, logging)
- User auth with mock OTP

### Phase 2: Core APIs (Week 2)
- User model + CRUD APIs
- Offer model + CRUD APIs
- Redemption flow (claim + QR)
- Category management

### Phase 3: Merchant APIs (Week 3)
- Merchant registration + approval
- Offer management for merchants
- QR scanning endpoint
- Subscription system

### Phase 4: Admin & Sub-Admin (Week 4)
- Sub-admin role + scoped access
- Admin dashboard APIs
- Analytics endpoints
- Staff management

### Phase 5: Polish (Week 5)
- Redis caching integration
- Rate limiting
- API documentation (Swagger)
- Testing

---

## 10. Summary

| Aspect | Choice |
|--------|--------|
| Database | MongoDB + Mongoose |
| Framework | Express.js |
| Auth | JWT (stateless) |
| OTP | Mock (123456) |
| API Style | REST |
| Validation | Zod |
| Caching | Redis (optional) |
| Testing | Jest + Supertest |

---

*Plan Version: 1.0*  
*Created: April 2026*  
*Status: Ready for Implementation*
