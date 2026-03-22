import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Bookmark, TrendingUp, CreditCard, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OFFERS, MERCHANTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AppShell from '@/components/layout/AppShell';
import OfferCard from '@/components/offers/OfferCard';
import EmptyState from '@/components/ui/EmptyState';

type TabKey = 'saved' | 'used' | 'expired';

export default function MyOffersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('saved');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [redemptions] = useLocalStorage<any[]>('offerly_redemptions', []);
  const [savedOfferIds] = useLocalStorage<string[]>('offerly_saved_offers', []);

  const tabs: { key: TabKey; label: string; count: number; icon: any }[] = [
    { key: 'saved', label: 'Saved', count: savedOfferIds.length, icon: Bookmark },
    { key: 'used', label: 'Used', count: redemptions.length, icon: Gift },
    { key: 'expired', label: 'Expired', count: 0, icon: Clock },
  ];

  const stats = [
    { label: 'Offers Used', value: user?.offersUsed || redemptions.length, icon: Gift, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Savings', value: `₹${user?.totalSavings || 0}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Bookmarked', value: savedOfferIds.length, icon: Bookmark, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-5 md:px-0 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="font-display font-bold text-2xl md:text-4xl text-app-text">My Offers</h1>
          
          {/* Tabs - Pill style */}
          <div className="glass-card !rounded-2xl p-1 flex gap-1 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-display font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.key ? 'bg-green-700 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid - Enhanced for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 md:p-6 rounded-[24px] border border-white/40 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {activeTab === 'used' && (
            redemptions.length === 0 ? (
              <div className="py-12 md:py-20">
                <EmptyState 
                  title="No used offers yet" 
                  description="Redeem your first offer to see it here and start tracking your savings!" 
                  action={{ label: 'Explore Offers', onClick: () => navigate('/explore') }} 
                />
              </div>
            ) : (
              <motion.div 
                initial="initial" 
                animate="animate" 
                variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {redemptions.map((r: any, i: number) => {
                  const offer = OFFERS.find(o => o.id === r.offerId);
                  const merchant = offer ? MERCHANTS.find(m => m.id === offer.merchantId) : undefined;
                  if (!offer) return null;
                  return (
                    <OfferCard key={i} offer={offer} merchant={merchant}
                      usedDate={new Date(r.redeemedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      savings={r.savings}
                    />
                  );
                })}
              </motion.div>
            )
          )}

          {activeTab === 'saved' && (
            savedOfferIds.length === 0 ? (
              <div className="py-12 md:py-20">
                <EmptyState 
                  icon={<Bookmark size={40} className="text-green-700 opacity-20" />} 
                  title="No saved offers yet" 
                  description="Tap the bookmark icon on any offer to save it for later use." 
                  action={{ label: 'Explore Offers', onClick: () => navigate('/explore') }} 
                />
              </div>
            ) : (
              <motion.div 
                initial="initial" 
                animate="animate" 
                variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {savedOfferIds.map((offerId) => {
                  const offer = OFFERS.find(o => o.id === offerId);
                  const merchant = offer ? MERCHANTS.find(m => m.id === offer.merchantId) : undefined;
                  if (!offer) return null;
                  return <OfferCard key={offerId} offer={offer} merchant={merchant} />;
                })}
              </motion.div>
            )
          )}

          {activeTab === 'expired' && (
            <div className="py-12 md:py-20">
              <EmptyState 
                icon={<Clock size={40} className="text-green-700 opacity-20" />} 
                title="No expired offers" 
                description="Your expired offers will automatically appear here." 
              />
            </div>
          )}
        </div>
      </motion.div>
    </AppShell>
  );
}
