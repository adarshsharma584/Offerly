export const MOCK_USER = {
  id: 'user_001',
  name: 'Rahul Sharma',
  phone: '+91 98767 54321',
  email: 'rahul@email.com',
  location: 'Golaghat, Assam',
  avatar: null,
  offersUsed: 12,
  totalSavings: 1240,
  joinedDate: '2024-01-15',
  notifications: 3,
};

export const MOCK_USERS = [
  MOCK_USER,
  {
    id: 'user_002',
    name: 'Priya Singh',
    phone: '+91 91234 56781',
    email: 'priya@email.com',
    location: 'Guwahati, Assam',
    avatar: null,
    offersUsed: 8,
    totalSavings: 980,
    joinedDate: '2024-02-10',
    notifications: 1,
  },
  {
    id: 'user_003',
    name: 'Amit Kumar',
    phone: '+91 91234 56782',
    email: 'amit@email.com',
    location: 'Jorhat, Assam',
    avatar: null,
    offersUsed: 16,
    totalSavings: 1760,
    joinedDate: '2024-03-02',
    notifications: 0,
  },
  {
    id: 'user_004',
    name: 'Sneha Das',
    phone: '+91 91234 56783',
    email: 'sneha@email.com',
    location: 'Dibrugarh, Assam',
    avatar: null,
    offersUsed: 5,
    totalSavings: 540,
    joinedDate: '2024-04-18',
    notifications: 2,
  },
  {
    id: 'user_005',
    name: 'Vikram Roy',
    phone: '+91 91234 56784',
    email: 'vikram@email.com',
    location: 'Tezpur, Assam',
    avatar: null,
    offersUsed: 12,
    totalSavings: 1420,
    joinedDate: '2024-05-26',
    notifications: 4,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'LayoutGrid' },
  { id: 'food', label: 'Food', icon: 'UtensilsCrossed' },
  { id: 'saloon', label: 'Salon', icon: 'Scissors' },
  { id: 'shops', label: 'Shops', icon: 'Store' },
  { id: 'gym', label: 'Gym', icon: 'Dumbbell' },
  { id: 'services', label: 'Services', icon: 'Wrench' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'Pill' },
  { id: 'electronics', label: 'Electronics', icon: 'Smartphone' },
  { id: 'fashion', label: 'Fashion', icon: 'Shirt' },
  { id: 'entertainment', label: 'Fun', icon: 'Gamepad2' },
];

export const MERCHANTS = [
  { id: 'M001', name: 'Cafe Delight', category: 'food', city: 'Golaghat', distance: 0.7, isVerified: true, isAd: true, adTier: 'premium' as const, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop', rating: 4.7, address: 'MG Road, Golaghat', phone: '+91 98765 43210', status: 'approved', lat: 26.5245, lng: 93.9601 },
  { id: 'M002', name: 'Style Salon', category: 'saloon', city: 'Golaghat', distance: 0.9, isVerified: true, isAd: true, adTier: 'growth' as const, image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=200&fit=crop', rating: 4.3, address: 'AT Road, Golaghat', phone: '+91 98765 43211', status: 'approved', lat: 26.5230, lng: 93.9585 },
  { id: 'M003', name: 'Royal Restaurant', category: 'food', city: 'Golaghat', distance: 1.5, isVerified: true, isAd: true, adTier: 'starter' as const, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop', rating: 4.5, address: 'Station Road, Golaghat', phone: '+91 98765 43212', status: 'approved', lat: 26.5260, lng: 93.9620 },
  { id: 'M004', name: 'Super Mart', category: 'shops', city: 'Golaghat', distance: 1.2, isVerified: true, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=200&fit=crop', rating: 4.0, address: 'Market Area, Golaghat', phone: '+91 98765 43213', status: 'approved', lat: 26.5215, lng: 93.9570 },
  { id: 'M005', name: 'Urban Fit Gym', category: 'gym', city: 'Golaghat', distance: 2.1, isVerified: true, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop', rating: 4.2, address: 'GNB Road, Golaghat', phone: '+91 98765 43214', status: 'approved', lat: 26.5280, lng: 93.9650 },
  { id: 'M006', name: 'Fresh Mart', category: 'shops', city: 'Golaghat', distance: 1.8, isVerified: true, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop', rating: 4.1, address: 'Dergaon Road, Golaghat', phone: '+91 98765 43215', status: 'approved', lat: 26.5200, lng: 93.9550 },
  { id: 'M007', name: 'Tech Haven', category: 'electronics', city: 'Golaghat', distance: 3.4, isVerified: false, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop', rating: 3.8, address: 'Fancy Bazar, Golaghat', phone: '+91 98765 43216', status: 'pending', lat: 26.5300, lng: 93.9700 },
  { id: 'M008', name: 'Quick Wheels', category: 'services', city: 'Golaghat', distance: 2.8, isVerified: true, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=200&fit=crop', rating: 4.0, address: 'NH 39, Golaghat', phone: '+91 98765 43217', status: 'approved', lat: 26.5180, lng: 93.9520 },
  { id: 'M009', name: 'MedPlus Pharmacy', category: 'pharmacy', city: 'Golaghat', distance: 0.5, isVerified: true, isAd: false, adTier: null, image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=200&fit=crop', rating: 4.4, address: 'Hospital Road, Golaghat', phone: '+91 98765 43218', status: 'approved', lat: 26.5250, lng: 93.9610 },
  { id: 'M010', name: 'Trendy Fashion', category: 'fashion', city: 'Golaghat', distance: 1.0, isVerified: true, isAd: true, adTier: 'growth' as const, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=200&fit=crop', rating: 4.1, address: 'City Center, Golaghat', phone: '+91 98765 43219', status: 'approved', lat: 26.5225, lng: 93.9595 },
];

export const OFFERS = [
  { id: 'O001', merchantId: 'M001', title: 'Buy 1 Get 1 Free on all drinks', desc: 'Buy any drink, get another FREE', type: 'bogo', value: 50, validTill: '2026-04-28', uses: 231, status: 'active', terms: 'Valid till 8 PM. Dine-in only. Not applicable on specials.' },
  { id: 'O002', merchantId: 'M002', title: 'Get 30% OFF on all services', desc: '30% off on haircut, spa & more', type: 'percent', value: 30, validTill: '2026-04-25', uses: 98, status: 'active', terms: 'Valid Mon–Sat only. Not applicable on festive days.' },
  { id: 'O003', merchantId: 'M003', title: 'Flat 20% OFF on total bill', desc: 'Save 20% on your entire order', type: 'percent', value: 20, validTill: '2026-09-30', uses: 124, status: 'active', terms: 'Valid on dine-in only. Max discount ₹500. Min bill ₹200.' },
  { id: 'O004', merchantId: 'M004', title: 'Save 10% on groceries', desc: '10% off on all grocery items', type: 'percent', value: 10, validTill: '2026-05-05', uses: 189, status: 'active', terms: 'Min purchase ₹500. Valid on all grocery items.' },
  { id: 'O005', merchantId: 'M005', title: 'Buy 1 Month Get 1 Free', desc: '2 months membership at 1 price', type: 'bogo', value: 50, validTill: '2026-06-30', uses: 45, status: 'active', terms: 'New members only. Annual plan not applicable.' },
  { id: 'O006', merchantId: 'M006', title: '10% Cashback on groceries', desc: 'Cashback applied at checkout', type: 'percent', value: 10, validTill: '2026-05-05', uses: 76, status: 'active', terms: 'Min bill ₹400. Cashback applied at counter.' },
  { id: 'O007', merchantId: 'M007', title: 'Flat 10% OFF on first order', desc: 'Welcome offer for new customers', type: 'percent', value: 10, validTill: '2026-05-10', uses: 154, status: 'active', terms: 'New customers only. One-time use per account.' },
  { id: 'O008', merchantId: 'M008', title: 'Free AC check-up worth ₹300', desc: 'Free with any service above ₹1000', type: 'flat', value: 300, validTill: '2026-04-30', uses: 32, status: 'active', terms: 'Valid on vehicle services above ₹1000 only.' },
  { id: 'O009', merchantId: 'M009', title: '15% OFF on medicines', desc: 'Save on prescription medicines', type: 'percent', value: 15, validTill: '2026-06-15', uses: 67, status: 'active', terms: 'Valid on all prescription meds. Min bill ₹300.' },
  { id: 'O010', merchantId: 'M010', title: 'Flat ₹500 OFF on ₹2000+', desc: 'Shop trendy fashion at discount', type: 'flat', value: 500, validTill: '2026-05-20', uses: 112, status: 'active', terms: 'Min purchase ₹2000. Not valid on sale items.' },
];

export const CITIES = ['Golaghat', 'Guwahati', 'Jorhat', 'Dibrugarh', 'Tezpur'];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New offer near you!', body: 'Cafe Delight has a new BOGO offer', time: '2 min ago' },
  { id: 'n2', title: 'Your savings milestone', body: 'You\'ve saved ₹1,200 with Offerly!', time: '1 hour ago' },
  { id: 'n3', title: 'Style Salon deal ending', body: '30% OFF expires tomorrow', time: '3 hours ago' },
];

// Merchant panel mock data
export const MOCK_MERCHANT_USER = {
  id: 'merchant_001',
  name: 'Style Salon',
  email: 'salon@email.com',
  phone: '+91 98765 43210',
  category: 'saloon',
  city: 'Golaghat',
  isVerified: true,
  plan: 'pro',
  totalOffers: 4,
  activeOffers: 2,
  totalRedemptions: 87,
  revenue: 12400,
  registeredAt: '2024-01-10',
  approvedAt: '2024-01-12',
};

export const REDEMPTION_HISTORY = [
  { id: 'R001', offerId: 'O001', customerName: 'Rahul Sharma', billAmount: 600, discount: 120, savings: 120, redeemedAt: '2026-03-19T14:30:00Z' },
  { id: 'R002', offerId: 'O001', customerName: 'Priya Agarwal', billAmount: 450, discount: 90, savings: 90, redeemedAt: '2026-03-19T11:15:00Z' },
  { id: 'R003', offerId: 'O002', customerName: 'Aman Verma', billAmount: 800, discount: 400, savings: 400, redeemedAt: '2026-03-18T16:45:00Z' },
  { id: 'R004', offerId: 'O001', customerName: 'Deepika Singh', billAmount: 1200, discount: 240, savings: 240, redeemedAt: '2026-03-18T13:20:00Z' },
  { id: 'R005', offerId: 'O001', customerName: 'Ravi Kumar', billAmount: 350, discount: 70, savings: 70, redeemedAt: '2026-03-17T17:00:00Z' },
];

export const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free Plan', monthly: 0, yearly: 0, maxOffers: 1, features: ['1 active offer', 'Basic analytics', 'Standard listing', 'Email support'] },
  { id: 'basic', name: 'Basic Plan', monthly: 299, yearly: 2990, maxOffers: 3, features: ['3 active offers', 'Standard analytics', 'Standard listing', 'Email support'] },
  { id: 'pro', name: 'Pro Plan', monthly: 499, yearly: 4990, maxOffers: 999, features: ['Unlimited offers', 'Full analytics', 'Priority support', 'Higher listing rank'] },
  { id: 'business', name: 'Business Plan', monthly: 999, yearly: 9990, maxOffers: 999, features: ['Everything in Pro', 'Advanced analytics', 'Dedicated manager', 'Multi-branch support'] },
];

export const AD_PLANS = [
  { id: 'starter', name: 'Starter Ad', monthly: 199, yearly: 1990, radius: 1, desc: 'Top of category in 1 km radius' },
  { id: 'growth', name: 'Growth Ad', monthly: 499, yearly: 4990, radius: 5, desc: 'Top of Home feed in 5 km radius' },
  { id: 'premium', name: 'Premium Ad', monthly: 999, yearly: 9990, radius: 999, desc: 'Featured banner + city-wide visibility' },
];

// Admin panel mock data
export const ADMIN_STATS = {
  totalUsers: 1240,
  totalMerchants: 86,
  activeOffers: 112,
  todayRedemptions: 34,
  pendingMerchantApprovals: 12,
  pendingOfferApprovals: 7,
  reportedIssues: 3,
  flaggedAccounts: 2,
  monthlyRevenue: 48600,
};

export const LIVE_ACTIVITY = [
  { id: 1, text: 'New merchant registered — Fresh Bites, Jaipur', time: '2m ago', type: 'merchant' },
  { id: 2, text: 'Offer redeemed by Rahul Sharma at Cafe Delight', time: '5m ago', type: 'redemption' },
  { id: 3, text: 'New offer submitted — Cafe Delight: Happy Hours 30% OFF', time: '12m ago', type: 'offer' },
  { id: 4, text: 'User flagged — Priya Agarwal (suspicious activity)', time: '28m ago', type: 'flag' },
  { id: 5, text: 'Urban Spa offer flagged — sudden spike in uses', time: '45m ago', type: 'flag' },
];
