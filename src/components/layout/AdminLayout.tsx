import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Store, Gift, Users, Shield, Settings, Home, Sparkles, LogOut, Bell, CalendarDays, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Footer from './Footer';

const navItems = [
  { path: '/admin', label: 'Overview', icon: BarChart3 },
  { path: '/admin/merchants', label: 'Merchants', icon: Store, badge: 12 },
  { path: '/admin/offers', label: 'All Offers', icon: Gift, badge: 7 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5FBF7]">
      <aside className="hidden md:flex fixed left-0 top-0 w-[272px] h-screen bg-white border-r border-green-100 flex-col z-30">
        <div className="px-6 py-7 border-b border-green-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center shadow-md shadow-green-900/20">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-app-text">OFFERLY</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Admin Control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="bg-green-50/70 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-700 flex items-center justify-center text-white font-display font-bold shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="font-display font-bold text-sm truncate">{user?.name || 'Admin'}</p>
              <p className="text-green-700/70 text-[10px] font-medium uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5">
          <p className="px-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-app-muted mb-4">Navigation</p>
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
                  {item.badge && (
                    <span className={`${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'} text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-1.5 border-t border-green-50">
          <p className="px-4 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-app-muted mb-2">Switch Panel</p>
          <Link to="/">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:text-green-700 hover:bg-green-50 transition-colors">
              <Home size={18} />
              <span className="font-display font-semibold text-sm">User App</span>
            </div>
          </Link>
          <Link to="/merchant">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:text-green-700 hover:bg-green-50 transition-colors">
              <Sparkles size={18} />
              <span className="font-display font-semibold text-sm">Merchant Portal</span>
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
              {navItems.find(i => i.path === location.pathname)?.label || 'Admin Dashboard'}
            </h2>
            <p className="text-[11px] text-app-muted mt-0.5 uppercase tracking-widest font-bold">Global Admin Panel</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border border-green-100 text-xs font-bold text-app-muted">
              <Building2 size={14} />
              All Cities
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
                <p className="text-xs font-display font-bold text-app-text">{user?.name}</p>
                <p className="text-[10px] text-app-muted font-medium">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-emerald-700 flex items-center justify-center text-white font-display font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#F5FBF7]">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-green-100 flex items-center justify-around px-4 z-40">
        {navItems.slice(0, 4).map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
              <Icon size={20} className={isActive ? 'text-green-700' : 'text-app-muted'} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-green-700' : 'text-app-muted'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
