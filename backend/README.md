# Offerly Backend API

## Overview
Backend API for Offerly - Local Discovery SaaS Platform. Built with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **OTP:** Mock mode (123456 for development)

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start MongoDB (if local)

5. Run the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/send-otp     - Send OTP to phone
POST /api/auth/verify-otp   - Verify OTP & login
POST /api/auth/logout       - Logout
GET  /api/auth/me           - Get current user
```

### User APIs
```
GET  /api/users/offers              - Browse offers
GET  /api/users/offers/:id          - Offer details
POST /api/users/offers/:id/claim     - Claim offer
GET  /api/users/offers/my          - My claimed offers
POST /api/users/redemptions/:id/generate-qr  - Generate QR code
GET  /api/users/redemptions/history - Redemption history
```

### Merchant APIs
```
POST /api/merchant/register         - Register merchant
GET  /api/merchant/profile         - Get profile
GET  /api/merchant/dashboard       - Dashboard stats
POST /api/merchant/offers          - Create offer
GET  /api/merchant/offers          - List offers
POST /api/merchant/scan            - Scan & verify QR
```

### Admin APIs
```
GET  /api/admin/dashboard          - Global dashboard
GET  /api/admin/merchants          - All merchants
GET  /api/admin/offers             - All offers
GET  /api/admin/users              - All users
GET  /api/admin/analytics          - Analytics
GET  /api/admin/staff             - Sub-admin list
POST /api/admin/staff             - Create sub-admin
```

### Sub-Admin APIs
```
GET  /api/subadmin/desk           - Get desk
GET  /api/subadmin/merchants      - Pending merchants
GET  /api/subadmin/offers         - Pending offers
GET  /api/subadmin/ads            - Pending ads
GET  /api/subadmin/tickets        - Support tickets
```

## OTP Testing

**Development Mode (Default OTP: 123456)**

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456", "role": "user"}'
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/offerly
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
├── config/         # Database & environment config
├── controllers/    # Business logic (by module)
│   ├── auth/       # Authentication
│   ├── user/       # User operations
│   ├── merchant/   # Merchant operations
│   ├── subAdmin/   # Sub-admin operations
│   └── admin/      # Admin operations
├── middleware/     # Auth, role, rate limit, error
├── models/         # MongoDB schemas
├── routes/         # API routes
├── services/       # OTP, QR, Auth services
├── utils/          # Validators, helpers
├── app.js          # Express app
└── server.js      # Entry point
```

## Testing with Frontend

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev` (in frontend folder)
3. Frontend will automatically connect to backend

## Features

- JWT-based authentication
- Role-based access control (User, Merchant, Sub-Admin, Admin)
- Mock OTP for development (123456)
- Rate limiting on sensitive endpoints
- Input validation with Joi
- MongoDB with proper indexing
- QR code generation for redemptions

## License

MIT
