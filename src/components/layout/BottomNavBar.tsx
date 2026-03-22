import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Gift, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/offers', label: 'Offers', icon: Gift },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass z-30 md:hidden !rounded-none border-x-0 border-b-0"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex items-center justify-around h-[70px]">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;
          return (
            <Link key={tab.path} to={tab.path} className="flex-1">
              <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1 py-2">
                <div className="relative">
                  {isActive ? (
                    <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
                      <Icon size={20} className="text-white" />
                    </div>
                  ) : (
                    <Icon size={22} className="text-app-muted" />
                  )}
                </div>
                <span className={`text-[10px] font-display font-semibold ${isActive ? 'text-green-700' : 'text-app-muted'}`}>
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
