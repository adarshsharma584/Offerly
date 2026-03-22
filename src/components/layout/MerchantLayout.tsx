import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Gift, Store, Settings, LogOut, Home, Sparkles, ScanLine, Bell, Shield, CalendarDays, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Footer from './Footer';

const navItems = [
  { path: '/merchant', label: 'Dashboard', icon: BarChart3 },
  { path: '/merchant/offers', label: 'My Offers', icon: Gift },
  { path: '/merchant/store', label: 'Store Profile', icon: Store },
  { path: '/merchant/settings', label: 'Settings', icon: Settings },
];

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5FBF7]">
      <aside className="hidden md:flex fixed left-0 top-0 w-[272px] h-screen bg-white border-r border-green-100 flex-col z-30">
        <div className="px-6 py-7 border-b border-green-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center shadow-md shadow-green-900/20">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-app-text">OFFERLY</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Merchant Portal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="bg-green-50/70 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-700 flex items-center justify-center text-white font-display font-bold shadow-sm">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="font-display font-bold text-sm truncate">{user?.businessName || user?.name}</p>
              <p className="text-green-700/70 text-[10px] font-medium uppercase tracking-wider">{user?.category || 'Merchant'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5">
          <p className="px-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-app-muted mb-4">Store Management</p>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive ? 'bg-green-700 text-white shadow-md shadow-green-900/15' : 'text-app-mid hover:text-green-700 hover:bg-green-50'
                }`}>
                  <Icon size={18} className={isActive ? 'text-white' : 'group-hover:text-green-700'} />
                  <span className="font-display font-semibold text-sm flex-1">{item.label}</span>
                </div>
              </Link>
            );
          })}
          
          <Link to="/merchant/scan">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
              location.pathname === '/merchant/scan' ? 'bg-green-800 text-white shadow-md shadow-green-900/20' : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}>
              <ScanLine size={18} />
              <span className="font-display font-bold text-sm flex-1">Scan Customer QR</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 mt-auto space-y-1.5 border-t border-green-50">
          <p className="px-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-app-muted mb-2">Switch Panel</p>
          <Link to="/">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:text-green-700 hover:bg-green-50 transition-colors">
              <Home size={18} />
              <span className="font-display font-semibold text-sm">User App</span>
            </div>
          </Link>
          <Link to="/admin">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:text-green-700 hover:bg-green-50 transition-colors">
              <Shield size={18} />
              <span className="font-display font-semibold text-sm">Admin Panel</span>
            </div>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors mt-4">
            <LogOut size={18} />
            <span className="font-display font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <div className="md:ml-[272px] min-h-screen flex flex-col">
        <header className="h-[72px] bg-white/90 backdrop-blur-xl border-b border-green-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h2 className="font-display font-bold text-lg text-app-text">
              {navItems.find(i => i.path === location.pathname)?.label || 'Merchant Dashboard'}
            </h2>
            <p className="text-[11px] text-app-muted mt-0.5 uppercase tracking-widest font-bold">Business Console</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-green-100 text-xs font-bold text-app-muted">
              <BadgeCheck size={14} className="text-green-700" />
              {user?.isVerified ? 'Verified Business' : 'Pending Verification'}
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-green-100 text-xs font-bold text-app-muted">
              <CalendarDays size={14} />
              Mar 2026
            </div>
            <div className="relative p-2 hover:bg-app-bg rounded-xl cursor-pointer transition-colors group">
              <Bell size={20} className="text-app-muted group-hover:text-green-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="h-8 w-px bg-app-border mx-1" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-display font-bold text-app-text">{user?.businessName}</p>
                <p className="text-[10px] text-app-muted font-medium capitalize">{user?.category} · {user?.isVerified ? '✅ Verified' : 'Pending'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-700 flex items-center justify-center text-white font-display font-bold shadow-sm">
                {user?.businessName?.charAt(0) || user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#F5FBF7]">
          <div className="max-w-[1000px] mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-green-100 flex items-center justify-around px-4 z-40">
        {navItems.slice(0, 3).map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
              <Icon size={20} className={isActive ? 'text-green-700' : 'text-app-muted'} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-green-700' : 'text-app-muted'}`}>{item.label}</span>
            </Link>
          );
        })}
        <Link to="/merchant/scan" className="flex flex-col items-center gap-1 -mt-8">
          <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center shadow-lg border-4 border-white">
            <ScanLine size={24} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-green-700 mt-1">Scan</span>
        </Link>
      </div>
    </div>
  );
}
