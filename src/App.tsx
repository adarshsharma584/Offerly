import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PlatformDataProvider } from "@/context/PlatformDataContext";
import { AnimatePresence } from "framer-motion";

// Error Boundary for handling lazy loading failures
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lazy loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-white">
          <div className="max-w-md w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">Failed to load the page. This might be due to a network error or an outdated version. Please try refreshing.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-display font-bold transition-all shadow-xl shadow-green-700/20"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load pages
const UserLoginPage = lazy(() => import("./pages/auth/UserLoginPage"));
const MerchantLoginPage = lazy(() => import("./pages/auth/MerchantLoginPage"));
const AdminLoginPage = lazy(() => import("./pages/auth/AdminLoginPage"));
const SubAdminLoginPage = lazy(() => import("./pages/auth/SubAdminLoginPage"));
const OTPPage = lazy(() => import("./pages/auth/OTPPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const ExplorePage = lazy(() => import("./pages/explore/ExplorePage"));
const MyOffersPage = lazy(() => import("./pages/offers/MyOffersPage"));
const OfferDetailPage = lazy(() => import("./pages/offers/OfferDetailPage"));
const QRRedeemPage = lazy(() => import("./pages/offers/QRRedeemPage"));
const ApprovedPage = lazy(() => import("./pages/offers/ApprovedPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("./pages/profile/EditProfilePage"));
const SupportPage = lazy(() => import("./pages/profile/SupportPage"));
const MerchantDashboard = lazy(() => import("./pages/merchant/MerchantDashboard"));
const MerchantPricingPage = lazy(() => import("./pages/merchant/MerchantPricingPage"));
const MerchantOffers = lazy(() => import("./pages/merchant/MerchantOffers"));
const MerchantAds = lazy(() => import("./pages/merchant/MerchantAds"));
const MerchantStore = lazy(() => import("./pages/merchant/MerchantStore"));
const MerchantSettings = lazy(() => import("./pages/merchant/MerchantSettings"));
const ScannerPage = lazy(() => import("./pages/merchant/ScannerPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const SubAdminDesk = lazy(() => import("./pages/sub-admin/SubAdminDesk"));
const AdminMerchants = lazy(() => import("./pages/admin/AdminMerchants"));
const AdminOffers = lazy(() => import("./pages/admin/AdminOffers"));
const AdminSubAdmins = lazy(() => import("./pages/admin/AdminSubAdmins"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-green-700 font-display font-bold animate-pulse">Loading Offerly...</p>
  </div>
);

function AuthGuard({
  children,
  loginPath = '/login',
}: {
  children: ReactNode;
  loginPath?: string;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to={loginPath} replace />;
  return <>{children}</>;
}

function MerchantGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'merchant') return <Navigate to="/merchant/login" replace />;
  if (!user.subscriptionPlan) return <Navigate to="/merchant/pricing" replace />;
  return <>{children}</>;
}

// Redirects logged-in users to their role's home page
function PublicRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = window.location.pathname;

  // Allow direct access to merchant/admin login even if logged in as a regular user,
  // but prevent user-to-user login redirection.
  if (user) {
    if (user.role === 'admin' && location === '/admin/login') return <>{children}</>;
    if (user.role === 'merchant' && location === '/merchant/login') return <>{children}</>;
    if (user.role === 'sub_admin' && location === '/sub-admin/login') return <>{children}</>;
    
    // Default redirections for logged-in users trying to access general login
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'merchant') return <Navigate to="/merchant" replace />;
    if (user.role === 'sub_admin') return <Navigate to="/sub-admin" replace />;
    if (user.role === 'user' && location === '/login') return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <AuthProvider>
    <PlatformDataProvider>
      <TooltipProvider>
        <Sonner position="top-center" expand={false} richColors />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public — separate login portals per role */}
                  <Route path="/login" element={<PublicRoute><UserLoginPage /></PublicRoute>} />
                  <Route path="/merchant/login" element={<PublicRoute><MerchantLoginPage /></PublicRoute>} />
                  <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
                  <Route path="/sub-admin/login" element={<PublicRoute><SubAdminLoginPage /></PublicRoute>} />
                  <Route path="/otp" element={<PublicRoute><OTPPage /></PublicRoute>} />

                  {/* User Panel */}
                  <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
                  <Route path="/explore" element={<AuthGuard><ExplorePage /></AuthGuard>} />
                  <Route path="/offers" element={<AuthGuard><MyOffersPage /></AuthGuard>} />
                  <Route path="/offers/:id" element={<AuthGuard><OfferDetailPage /></AuthGuard>} />
                  <Route path="/offers/:id/redeem" element={<AuthGuard><QRRedeemPage /></AuthGuard>} />
                  <Route path="/offers/:id/approved" element={<AuthGuard><ApprovedPage /></AuthGuard>} />
                  <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
                  <Route path="/profile/edit" element={<AuthGuard><EditProfilePage /></AuthGuard>} />
                  <Route path="/profile/support" element={<AuthGuard><SupportPage /></AuthGuard>} />

                  {/* Merchant Panel */}
                  <Route path="/merchant/pricing" element={<AuthGuard loginPath="/merchant/login"><MerchantPricingPage /></AuthGuard>} />
                  <Route path="/merchant" element={<MerchantGuard><MerchantDashboard /></MerchantGuard>} />
                  <Route path="/merchant/offers" element={<MerchantGuard><MerchantOffers /></MerchantGuard>} />
                  <Route path="/merchant/ads" element={<MerchantGuard><MerchantAds /></MerchantGuard>} />
                  <Route path="/merchant/store" element={<MerchantGuard><MerchantStore /></MerchantGuard>} />
                  <Route path="/merchant/settings" element={<MerchantGuard><MerchantSettings /></MerchantGuard>} />
                  <Route path="/merchant/scan" element={<MerchantGuard><ScannerPage /></MerchantGuard>} />

                  {/* Admin Panel */}
                  <Route path="/admin" element={<AuthGuard loginPath="/admin/login"><AdminDashboard /></AuthGuard>} />
                  <Route path="/admin/merchants" element={<AuthGuard loginPath="/admin/login"><AdminMerchants /></AuthGuard>} />
                  <Route path="/admin/offers" element={<AuthGuard loginPath="/admin/login"><AdminOffers /></AuthGuard>} />
                  <Route path="/admin/ads" element={<AuthGuard loginPath="/admin/login"><AdminOffers /></AuthGuard>} />
                  <Route path="/admin/users" element={<AuthGuard loginPath="/admin/login"><AdminUsers /></AuthGuard>} />
                  <Route path="/admin/staff" element={<AuthGuard loginPath="/admin/login"><AdminSubAdmins /></AuthGuard>} />
                  <Route path="/admin/settings" element={<AuthGuard loginPath="/admin/login"><AdminSettings /></AuthGuard>} />

                  {/* Sub-Admin Panel */}
                  <Route path="/sub-admin" element={<AuthGuard loginPath="/sub-admin/login"><SubAdminDesk /></AuthGuard>} />
                  <Route path="/sub-admin/merchants" element={<AuthGuard loginPath="/sub-admin/login"><SubAdminDesk /></AuthGuard>} />
                  <Route path="/sub-admin/offers" element={<AuthGuard loginPath="/sub-admin/login"><SubAdminDesk /></AuthGuard>} />
                  <Route path="/sub-admin/ads" element={<AuthGuard loginPath="/sub-admin/login"><SubAdminDesk /></AuthGuard>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </PlatformDataProvider>
  </AuthProvider>
);

export default App;
