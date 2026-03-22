import { useLocation, Link } from 'react-router-dom';
import { Home, Compass, Gift, User, Settings, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/offers', label: 'My Offers', icon: Gift },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-white/30 flex-col z-30 transition-all duration-300 ${
        collapsed ? 'w-[88px]' : 'w-[260px]'
      }`}
      style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.04)' }}
    >
      <div className={`p-6 ${collapsed ? 'px-4' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
            <Gift size={20} className="text-white" />
          </div>
          <div className={`${collapsed ? 'hidden' : ''}`}>
            <span className="font-display font-bold text-lg text-green-700">OFFERLY</span>
            <p className="text-app-muted text-[10px] leading-none">Consumer App</p>
          </div>
        </div>
      </div>

      <div className="border-t border-green-50 mx-5" />

      {user && (
        <>
          <div className={`px-5 py-4 flex items-center gap-3 ${collapsed ? 'px-4 justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center text-white font-display font-bold shadow-glow">
              {user.name.charAt(0)}
            </div>
            <div className={`${collapsed ? 'hidden' : ''}`}>
              <p className="font-display font-semibold text-sm text-app-text">{user.name}</p>
              <p className="text-app-muted text-xs">{user.location}</p>
            </div>
          </div>
          <div className="border-t border-green-50 mx-5" />
        </>
      )}

      <nav className="flex-1 px-3 py-4 space-y-3">
        <p className={`px-4 text-[10px] font-display font-bold uppercase tracking-wider text-app-muted ${collapsed ? 'text-center px-0' : ''}`}>Menu</p>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} title={item.label}>
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative ${
                isActive ? 'gradient-accent text-white shadow-glow' : 'text-app-mid hover:bg-green-50'
              } ${collapsed ? 'justify-center' : ''}`}>
                <Icon size={18} />
                <span className={`font-display font-semibold text-sm flex-1 ${collapsed ? 'hidden' : ''}`}>{item.label}</span>
                <ChevronRight size={14} className={`${isActive ? 'text-white/60' : 'text-app-muted'} ${collapsed ? 'hidden' : ''}`} />
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-green-50 mx-5" />

      <div className="px-3 py-4 space-y-2">
        <p className={`px-4 text-[10px] font-display font-bold uppercase tracking-wider text-app-muted ${collapsed ? 'text-center px-0' : ''}`}>Account</p>
        <Link to="/merchant" title="Merchant Panel">
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:bg-green-50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <Sparkles size={18} />
            <span className={`font-display font-semibold text-sm ${collapsed ? 'hidden' : ''}`}>Merchant Panel</span>
          </div>
        </Link>
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-app-mid hover:bg-green-50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`} title="Settings">
          <Settings size={18} />
          <span className={`font-display font-semibold text-sm ${collapsed ? 'hidden' : ''}`}>Settings</span>
        </div>
        <div onClick={logout} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`} title="Logout">
          <LogOut size={18} />
          <span className={`font-display font-semibold text-sm ${collapsed ? 'hidden' : ''}`}>Logout</span>
        </div>
      </div>
    </aside>
  );
}
