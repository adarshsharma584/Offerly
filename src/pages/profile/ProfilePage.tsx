import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, Gift, Bell, HelpCircle, FileText, LogOut, ChevronRight, MapPin, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AppShell from '@/components/layout/AppShell';
import BottomSheet from '@/components/ui/BottomSheet';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: Edit3, label: 'Edit Profile', desc: 'Update your name, phone and location', action: () => navigate('/profile/edit') },
        { icon: Gift, label: 'My Offers', desc: 'View your saved and used deals', action: () => navigate('/offers') },
        { icon: Bell, label: 'Notifications', desc: 'Stay updated with latest local deals', action: () => setShowNotifs(true), badge: user.notifications },
      ]
    },
    {
      title: 'Support & Settings',
      items: [
        { icon: Settings, label: 'Settings', desc: 'Manage app preferences', action: () => {} },
        { icon: HelpCircle, label: 'Help & Support', desc: 'Get assistance from our team', action: () => setShowHelp(true) },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: FileText, label: 'Terms & Policies', desc: 'Read our service agreements', action: () => setShowTerms(true) },
      ]
    }
  ];

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto pt-4 pb-12"
      >
        <div className="md:grid md:grid-cols-[340px_1fr] md:gap-8 items-start">
          {/* Left Column: Profile Card & Stats (Sticky on Desktop) */}
          <div className="md:sticky md:top-24 space-y-6">
            {/* Profile Header Card */}
            <div className="mx-5 md:mx-0 rounded-[32px] overflow-hidden shadow-2xl shadow-green-900/20" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)' }}>
              <div className="px-6 md:px-8 pt-8 md:pt-10 pb-6 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 md:w-28 md:h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-display font-bold text-3xl md:text-4xl shadow-glow">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl md:text-2xl text-white">{user?.name || 'User'}</h2>
                  <p className="text-white/60 text-xs md:text-sm mt-1">{user?.phone || 'No phone number'}</p>
                  {user?.location && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-white/80 text-[10px] md:text-xs mt-3 border border-white/10">
                      <MapPin size={12} className="text-green-400" /> {user.location}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-t border-white/10">
                {[
                  { value: String(user.offersUsed || 0), label: 'Offers' },
                  { value: `₹${user.totalSavings || 0}`, label: 'Saved' },
                  { value: user.location ? user.location.split(',')[0] : 'N/A', label: 'City' },
                ].map((stat, i) => (
                  <div key={stat.label} className={`py-4 md:py-5 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <p className="text-white font-display font-bold text-lg">{stat.value}</p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty Card Placeholder - Desktop Only */}
            <div className="hidden md:block glass-card p-6 rounded-3xl border-dashed border-2 border-green-200 bg-green-50/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-display font-bold text-sm text-gray-900">Offerly Rewards</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">You're just 3 redemptions away from becoming a <span className="text-green-700 font-bold">Gold Member</span>.</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-green-600 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Menu Items */}
          <div className="mt-8 md:mt-0 px-5 md:px-0 space-y-8">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-display font-bold text-xs text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">{section.title}</h3>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {section.items.map((item, i) => (
                    <div
                      key={item.label}
                      onClick={item.action}
                      className={`flex items-center gap-4 px-6 py-4 md:py-5 cursor-pointer hover:bg-gray-50 transition-all group ${
                        i < section.items.length - 1 ? 'border-b border-gray-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700 group-hover:bg-green-700 group-hover:text-white transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-sm md:text-base text-gray-900">{item.label}</h4>
                        <p className="hidden md:block text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/20">{item.badge}</span>
                        )}
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-green-700 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-3 py-5 bg-red-50 hover:bg-red-100 text-red-600 rounded-3xl font-display font-bold text-sm md:text-base transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Logout from Account
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sheets */}
      <BottomSheet isOpen={showLogout} onClose={() => setShowLogout(false)} title="Logout">
        <p className="text-app-muted text-sm mb-6">Are you sure you want to logout?</p>
        <div className="grid grid-cols-2 gap-3">
          <div onClick={() => setShowLogout(false)} className="py-3 rounded-full border border-app-border text-center font-display font-bold text-sm cursor-pointer hover:bg-green-50 transition-colors text-app-text">Cancel</div>
          <div onClick={handleLogout} className="py-3 rounded-full bg-red-600 text-white text-center font-display font-bold text-sm cursor-pointer hover:bg-red-700 transition-colors">Logout</div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showNotifs} onClose={() => setShowNotifs(false)} title="Notifications">
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map(n => (
            <div key={n.id} className="p-3 bg-green-50 rounded-xl">
              <h4 className="font-display font-bold text-sm text-app-text">{n.title}</h4>
              <p className="text-app-muted text-xs mt-1">{n.body}</p>
              <p className="text-app-muted text-[10px] mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showHelp} onClose={() => setShowHelp(false)} title="Help & Support">
        <p className="text-app-muted text-sm">Email us at <span className="text-green-700 font-bold">support@offerly.in</span></p>
      </BottomSheet>

      <BottomSheet isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms & Policies">
        <p className="text-app-muted text-sm leading-relaxed">By using Offerly, you agree to our terms of service. Offers are provided by merchants and Offerly acts only as a discovery platform. We do not process payments or guarantee offer availability.</p>
      </BottomSheet>
    </AppShell>
  );
}
