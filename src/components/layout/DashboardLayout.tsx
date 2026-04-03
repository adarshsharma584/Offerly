import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Gift, Store, Settings, LogOut, Home, 
  Shield, ScanLine, Bell, CalendarDays, ChevronLeft, 
  ChevronRight, LayoutDashboard, UserCheck, MessageSquare, 
  BadgePercent, PanelLeftClose, PanelLeftOpen, Sparkles, Users,
  X, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  path: string;
  label: string;
  icon: any;
}

const merchantNav: SidebarItem[] = [
  { path: '/merchant', label: 'Dashboard', icon: BarChart3 },
  { path: '/merchant/offers', label: 'My Offers', icon: Gift },
  { path: '/merchant/ads', label: 'Ads Manager', icon: Sparkles },
  { path: '/merchant/store', label: 'Store Profile', icon: Store },
  { path: '/merchant/settings', label: 'Settings', icon: Settings },
];

const adminNav: SidebarItem[] = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/merchants', label: 'Merchants', icon: Store },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/offers', label: 'Available Offers', icon: Gift },
  { path: '/admin/ads', label: 'Ad Approval', icon: Sparkles },
  { path: '/admin/subscriptions', label: 'Subscriptions', icon: BadgePercent },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/staff', label: 'Sub-Admins', icon: ShieldCheck },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const subAdminNav: SidebarItem[] = [
  { path: '/sub-admin', label: 'My Desk', icon: LayoutDashboard },
  { path: '/sub-admin/merchants', label: 'Merchant Mgmt', icon: Store },
  { path: '/sub-admin/offers', label: 'Offer Mgmt', icon: Gift },
  { path: '/sub-admin/ads', label: 'Ad Mgmt', icon: Sparkles },
];

export default function DashboardLayout({ 
  children, 
  role = 'merchant' 
}: { 
  children: ReactNode; 
  role?: 'merchant' | 'admin' | 'sub_admin';
}) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = role === 'admin' ? adminNav : role === 'sub_admin' ? subAdminNav : merchantNav;
  const portalName = role === 'admin' ? 'Admin Console' : role === 'sub_admin' ? 'Staff Portal' : 'Merchant Portal';
  const PortalIcon = role === 'admin' ? Shield : role === 'sub_admin' ? UserCheck : Store;

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="h-[72px] flex items-center px-6 border-b border-slate-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-900/10">
            <PortalIcon size={20} className="text-white" />
          </div>
          {(!collapsed || mobileMenuOpen) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="font-display font-bold text-lg tracking-tight text-slate-900">OFFERLY</span>
              <p className="text-green-700 text-[9px] font-bold uppercase tracking-widest leading-none">{portalName}</p>
            </motion.div>
          )}
        </div>
        {mobileMenuOpen && (
          <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-2 text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Mini Profile */}
      {(!collapsed || mobileMenuOpen) && (
        <div className="px-4 py-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-green-700 font-display font-bold shadow-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-display font-bold text-xs text-slate-900 truncate">{user?.businessName || user?.name}</p>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {(!collapsed || mobileMenuOpen) && (
          <p className="px-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Main Menu</p>
        )}
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              title={collapsed && !mobileMenuOpen ? item.label : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-green-700 text-white shadow-lg shadow-green-900/10' 
                  : 'text-slate-600 hover:text-green-700 hover:bg-green-50'
              } ${(collapsed && !mobileMenuOpen) ? 'justify-center' : ''}`}>
                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-green-700'} />
                {(!collapsed || mobileMenuOpen) && <span className="font-display font-semibold text-sm flex-1">{item.label}</span>}
              </div>
            </Link>
          );
        })}
        
        {role === 'merchant' && (
          <Link to="/merchant/scan" onClick={() => setMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group mt-4 ${
              location.pathname === '/merchant/scan' 
                ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/10' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            } ${(collapsed && !mobileMenuOpen) ? 'justify-center' : ''}`}>
              <ScanLine size={20} />
              {(!collapsed || mobileMenuOpen) && <span className="font-display font-bold text-sm flex-1">Scan QR</span>}
            </div>
          </Link>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-50 space-y-1">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-green-700 hover:bg-green-50 transition-colors ${(collapsed && !mobileMenuOpen) ? 'justify-center' : ''}`}>
            <Home size={18} />
            {(!collapsed || mobileMenuOpen) && <span className="font-display font-semibold text-xs">User App</span>}
          </div>
        </Link>
        <button 
          onClick={logout} 
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors ${(collapsed && !mobileMenuOpen) ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          {(!collapsed || mobileMenuOpen) && <span className="font-display font-semibold text-xs">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] bg-white z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex-col z-30 transition-all duration-300 ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        }`}
      >
        <SidebarContent />

        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[84px] w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-green-700 shadow-sm z-40 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'md:ml-[80px]' : 'md:ml-[280px]'} min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden"
            >
              <PanelLeftOpen size={24} />
            </button>
            <h2 className="font-display font-bold text-lg text-slate-900 truncate">
              {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
            </h2>
            {role === 'merchant' && user?.subscriptionPlan && (
              <span className="hidden xs:inline-block bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {user.subscriptionPlan} Plan
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-slate-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 md:mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-none capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-display font-bold border border-slate-200 flex-shrink-0">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Sub-component for simple icons
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
