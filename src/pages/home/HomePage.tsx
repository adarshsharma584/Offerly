import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, MapPin, ArrowRight, Star, Gift, 
  Utensils, Scissors, Store, Dumbbell, Wrench, Plus, 
  ChevronLeft, ChevronRight, TrendingUp, Users, Bookmark, 
  Trophy, Zap, Clock, ShieldCheck, Heart, Share2, ArrowUpRight
} from 'lucide-react';
import { MERCHANTS, OFFERS } from '@/data/mockData';
import { useOffers } from '@/hooks/useOffers';
import AppShell from '@/components/layout/AppShell';
import OfferCard from '@/components/offers/OfferCard';
import FeaturedBanner from '@/components/offers/FeaturedBanner';
import CategoryGrid from '@/components/offers/CategoryGrid';
import SlidingBanners from '@/components/offers/SlidingBanners';
import MerchantCard from '@/components/offers/MerchantCard';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const listVariants = { animate: { transition: { staggerChildren: 0.1 } } };

const categories = [
  { id: 'food', label: 'Food', icon: Utensils, color: 'text-green-700', bg: 'bg-green-50' },
  { id: 'saloon', label: 'Saloon', icon: Scissors, color: 'text-purple-700', bg: 'bg-purple-50' },
  { id: 'shops', label: 'Shops', icon: Store, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'gym', label: 'Gym', icon: Dumbbell, color: 'text-orange-700', bg: 'bg-orange-50' },
  { id: 'services', label: 'Services', icon: Wrench, color: 'text-teal-700', bg: 'bg-teal-50' },
  { id: 'more', label: 'More', icon: Plus, color: 'text-gray-700', bg: 'bg-gray-50' },
];

const heroSlides = [
  {
    title: "Save More on Everything You Love",
    desc: "Explore exclusive offers from trusted local merchants. From food to fitness, find the best deals near you.",
    badge: "Discover Local Deals",
    gradient: "from-green-700 via-green-600 to-emerald-600",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop"
  },
  {
    title: "Best Local Offers, Just for You",
    desc: "Unbeatable discounts at your favorite neighborhood spots. Verified merchants and daily updates.",
    badge: "Daily Updates",
    gradient: "from-emerald-700 via-emerald-600 to-teal-600",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop"
  },
  {
    title: "Support Local, Save Big",
    desc: "Helping local businesses grow while you save money. Join the community and start exploring today.",
    badge: "Community First",
    gradient: "from-green-800 via-green-700 to-emerald-700",
    image: "https://images.unsplash.com/photo-1531050171669-7df9b90969a6?w=1200&auto=format&fit=crop"
  }
];

import { OfferCardSkeleton, MerchantCardSkeleton } from '@/components/ui/Skeletons';
import { Skeleton } from '@/components/ui/skeleton';

const RecentSavingsTicker = () => (
  <div className="bg-green-50 border-y border-green-100 py-2.5 overflow-hidden whitespace-nowrap relative z-10">
    <div className="flex animate-marquee gap-10">
      {[
        "Rahul saved ₹500 at Cafe Delight",
        "Priya claimed 20% OFF at Burger King",
        "Adarsh saved ₹1,200 on Gym Membership",
        "Sneha got BOGO at Lakme Salon",
        "Offerly reached 10,000+ local savers today!"
      ].map((text, i) => (
        <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
          {text}
        </div>
      ))}
    </div>
  </div>
);

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [currentHero, setCurrentHero] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sortedOffers = useOffers(activeCat);
  const topMerchants = MERCHANTS.filter(m => m.isVerified).slice(0, 6);

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-5 pt-4 space-y-12">
          <Skeleton className="h-64 w-full rounded-[32px]" />
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <OfferCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <RecentSavingsTicker />
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto md:px-8 lg:px-12"
      >
        {/* Modern Hero Section */}
        <div className="relative h-[320px] md:h-[380px] mt-6 px-5 md:px-0 mb-10">
          <div className="w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={heroSlides[currentHero].image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop"} 
                  className="w-full h-full object-cover" 
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
              <div className="max-w-2xl space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  <Sparkles size={12} className="text-green-400" />
                  {heroSlides[currentHero].badge}
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl md:text-5xl font-display font-bold text-white leading-tight"
                >
                  {heroSlides[currentHero].title}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-white/70 text-sm md:text-base max-w-lg leading-relaxed font-medium line-clamp-2 md:line-clamp-none"
                >
                  {heroSlides[currentHero].desc}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-2"
                >
                  <button 
                    onClick={() => navigate('/explore')}
                    className="px-8 py-4 bg-green-600 text-white rounded-xl font-display font-bold shadow-xl shadow-green-900/40 hover:bg-green-700 transition-all hover:-translate-y-1 btn-press flex items-center justify-center gap-2 text-sm"
                  >
                    Start Exploring <ArrowRight size={18} />
                  </button>
                  <div className="flex -space-x-2 items-center">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                      </div>
                    ))}
                    <span className="pl-4 text-white/80 text-[10px] font-bold uppercase tracking-widest">10k+ local savers</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button 
                onClick={() => setCurrentHero(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentHero(prev => (prev + 1) % heroSlides.length)}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Category Grid - Only visible on desktop */}
        <div className="hidden md:block mb-10">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-green-700 rounded-full" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[24px] transition-all duration-300 hover:-translate-y-1 ${
                  activeCat === cat.id 
                    ? 'bg-green-700 text-white shadow-xl shadow-green-700/20 ring-4 ring-green-100' 
                    : `${cat.bg} ${cat.color} hover:shadow-lg hover:bg-white border border-transparent hover:border-green-100`
                }`}
              >
                <cat.icon size={28} />
                <span className="font-display font-bold text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Merchants Spotlight - Laptop Only */}
        <div className="hidden lg:block mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              Top Rated Merchants
            </h2>
            <button onClick={() => navigate('/explore')} className="text-green-700 font-display font-bold text-sm hover:underline">
              Explore All
            </button>
          </div>
          <div className="grid grid-cols-6 gap-6">
            {topMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </div>

        {/* Featured Advertising Section - 3:4 Ratio Cards */}
        <div className="px-5 md:px-0 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Sparkles size={20} className="fill-amber-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-app-text tracking-tight">Handpicked for You</h2>
                <p className="text-xs md:text-sm text-app-muted mt-0.5">Premium deals from top-rated merchants</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold animate-pulse border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              HOT DEALS
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar -mx-5 px-5 md:mx-0 md:px-0">
            {MERCHANTS.filter(m => m.isAd).slice(0, 6).map((merchant, idx) => {
              const offer = OFFERS.find(o => o.merchantId === merchant.id);
              if (!offer) return null;
              return (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[200px] md:w-[260px]"
                >
                  <Link to={`/offers/${offer.id}`} className="block group">
                    <div className="relative aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                      {/* Merchant Image */}
                      <img 
                        src={merchant.image} 
                        alt={merchant.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Premium Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg">
                          <span className="text-white text-[9px] font-bold uppercase tracking-widest">Sponsored</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Bookmark size={14} />
                        </div>
                      </div>

                      {/* Content Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-lg">
                            <span className="text-green-700 font-display font-bold text-sm">{merchant.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-display font-bold text-xs truncate drop-shadow-md">{merchant.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star size={8} className="text-amber-400 fill-amber-400" />
                              <span className="text-white/80 text-[9px] font-bold">{merchant.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-white font-display font-bold text-base md:text-lg mb-3 leading-tight drop-shadow-lg group-hover:text-green-400 transition-colors">
                          {offer.title}
                        </h3>
                        
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <span className="text-white/70 text-[10px] flex items-center gap-1 font-medium">
                            <MapPin size={10} className="text-green-400" />
                            {merchant.distance} km away
                          </span>
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-glow transform scale-0 group-hover:scale-100 transition-transform duration-500">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Nearby Offers List */}
        <div className="px-5 md:px-0 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-green-50 text-green-700">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-app-text">Offers for You</h2>
              <p className="text-sm text-app-muted mt-1">Based on your location</p>
            </div>
          </div>
          <motion.div variants={listVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {sortedOffers.slice(1).map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                merchant={MERCHANTS.find(m => m.id === offer.merchantId)}
              />
            ))}
          </motion.div>
        </div>

        {/* Catchy Section: Flash Deals & Community Rewards */}
        <div className="px-5 md:px-0 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Flash Deals (Lively & Urgent) */}
            <div className="lg:col-span-8">
              <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-[32px] p-6 md:p-8 relative overflow-hidden group h-full shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                        <Zap size={24} className="text-white fill-white animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white">Flash Deals</h2>
                        <p className="text-white/80 text-xs">Lightning fast savings! Ends in 04:52:10</p>
                      </div>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold transition-all border border-white/10">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {OFFERS.slice(0, 2).map((offer, i) => {
                      const merchant = MERCHANTS.find(m => m.id === offer.merchantId);
                      return (
                        <motion.div 
                          key={offer.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 group/card cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20 shadow-lg">
                            <img src={merchant?.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="bg-white text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">SAVE 50%</span>
                              <span className="text-white/60 text-[10px] truncate">{merchant?.name}</span>
                            </div>
                            <h4 className="text-white font-display font-bold text-sm truncate">{offer.title}</h4>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: i === 0 ? '85%' : '40%' }}
                                  className="h-full bg-white rounded-full"
                                />
                              </div>
                              <span className="text-white/80 text-[9px] font-bold">{i === 0 ? '85%' : '40%'} SOLD</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Community Rewards (Gamified & Attractive) */}
            <div className="lg:col-span-4">
              <div className="bg-[#1B4332] rounded-[32px] p-6 md:p-8 h-full relative overflow-hidden group shadow-2xl border border-green-800">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-4 border border-green-500/20">
                      <Trophy size={24} />
                    </div>
                    <h2 className="text-xl font-display font-bold text-white mb-2">Community Rewards</h2>
                    <p className="text-green-50/60 text-xs leading-relaxed">
                      Collect coins on every claim & unlock mega local coupons!
                    </p>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                          <span className="text-amber-400 font-bold text-xs">C</span>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider">Your Balance</p>
                          <p className="text-white font-display font-bold text-lg">450 Coins</p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-green-500" />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 group/gift cursor-pointer hover:bg-white/10 transition-colors">
                          <Gift size={20} className="text-purple-400 group-hover/gift:scale-110 transition-transform" />
                          <span className="text-white/60 text-[9px] font-bold">200 COINS</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 11: Community Engagement - Leaderboard & Referrals */}
        <div className="px-5 md:px-0 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Top Savers Leaderboard */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-black/[0.02] p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-900">Top Savers</h2>
                    <p className="text-slate-400 text-xs mt-1">This week's biggest discount hunters</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Trophy size={20} />
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { name: 'Rahul Boro', saved: 4520, claims: 12, rank: 1, avatar: 'RB' },
                    { name: 'Priya Das', saved: 3850, claims: 9, rank: 2, avatar: 'PD' },
                    { name: 'Adarsh K.', saved: 2900, claims: 15, rank: 3, avatar: 'AK' },
                    { name: 'Sneha Roy', saved: 2100, claims: 6, rank: 4, avatar: 'SR' },
                  ].map((user, i) => (
                    <div key={user.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm ${
                            i === 0 ? 'bg-amber-100 text-amber-700' : 
                            i === 1 ? 'bg-slate-100 text-slate-600' :
                            i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                          }`}>
                            {user.avatar}
                          </div>
                          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                            i === 0 ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {user.rank}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-green-700 transition-colors">{user.name}</h4>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{user.claims} Claims</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-700 font-display font-bold">₹{user.saved}</p>
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Saved</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-display font-bold text-xs hover:bg-green-50 hover:text-green-700 transition-all">
                  View Full Leaderboard
                </button>
              </div>
            </div>

            {/* Refer & Earn UI */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[40px] p-8 md:p-12 relative overflow-hidden h-full shadow-2xl">
                {/* Visual elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                      <Users size={12} />
                      Limited Time Offer
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                      Friends Save,<br/>You <span className="text-green-400">Earn.</span>
                    </h2>
                    <p className="text-green-100/70 text-sm leading-relaxed">
                      Invite your friends to Offerly. When they claim their first offer, you both get 100 bonus coins!
                    </p>
                    <div className="flex gap-3">
                      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                        <span className="text-white font-display font-bold text-sm tracking-widest uppercase">OFFERLY50</span>
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Copy</span>
                      </div>
                      <button className="w-14 h-14 rounded-2xl bg-white text-green-700 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                        <Share2 size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col gap-4">
                    {[
                      { icon: '🎁', title: 'Share your code', desc: 'Invite friends via WhatsApp' },
                      { icon: '📱', title: 'Friend signs up', desc: 'Using your referral link' },
                      { icon: '💰', title: 'Both get rewarded', desc: 'Instantly in your wallet' },
                    ].map((step, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <h4 className="text-white font-display font-bold text-sm">{step.title}</h4>
                          <p className="text-green-100/50 text-[10px]">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
