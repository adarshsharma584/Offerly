import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, ArrowRight, Star, Gift, Utensils, Scissors, Store, Dumbbell, Wrench, Plus, ChevronLeft, ChevronRight, TrendingUp, Users, Bookmark, Trophy, Zap, Clock, ShieldCheck, Heart } from 'lucide-react';
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
    gradient: "from-green-700 via-green-600 to-emerald-600"
  },
  {
    title: "Best Local Offers, Just for You",
    desc: "Unbeatable discounts at your favorite neighborhood spots. Verified merchants and daily updates.",
    badge: "Daily Updates",
    gradient: "from-emerald-700 via-emerald-600 to-teal-600"
  },
  {
    title: "Support Local, Save Big",
    desc: "Helping local businesses grow while you save money. Join the community and start exploring today.",
    badge: "Community First",
    gradient: "from-green-800 via-green-700 to-emerald-700"
  }
];

export default function HomePage() {
  const [activeCat, setActiveCat] = useState('all');
  const [currentHero, setCurrentHero] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sortedOffers = useOffers(activeCat);
  const featuredOffer = sortedOffers[0];
  const featuredMerchant = MERCHANTS.find(m => m.id === featuredOffer?.merchantId);
  const topMerchants = MERCHANTS.filter(m => m.isVerified).slice(0, 6);

  return (
    <AppShell>
      <motion.div variants={pageVariants} initial="initial" animate="animate" className="pb-12">
        {/* Desktop Hero Section - Sliding Banners */}
        <div className="hidden md:block mb-10 relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`bg-gradient-to-br ${heroSlides[currentHero].gradient} rounded-[32px] p-8 lg:p-10 relative overflow-hidden shadow-xl min-h-[300px] flex items-center`}
            >
              {/* Background patterns */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10 flex items-center justify-between gap-10 w-full">
                <div className="max-w-xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4"
                  >
                    <Sparkles size={12} />
                    {heroSlides[currentHero].badge}
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight"
                  >
                    {heroSlides[currentHero].title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base text-green-50/80 mb-6 leading-relaxed max-w-lg"
                  >
                    {heroSlides[currentHero].desc}
                  </motion.p>
                  
                  {/* Desktop Search Bar */}
                  <div className="relative max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      onClick={() => navigate('/explore?focus=true')}
                      placeholder="Search for shops, restaurants, services..."
                      className="w-full bg-white py-3.5 pl-14 pr-6 text-sm text-gray-700 rounded-2xl border-0 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-xl cursor-pointer"
                      readOnly
                    />
                  </div>
                </div>

                {/* Hero Featured Card - Laptop Only */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 font-bold text-lg">S</div>
                      <div>
                        <h4 className="text-white font-display font-bold text-xs">Style Salon</h4>
                        <p className="text-white/60 text-[9px]">900m away</p>
                      </div>
                    </div>
                    <h3 className="text-white font-display font-bold text-base mb-4 leading-tight">30% OFF on all services</h3>
                    <button className="w-full py-2.5 bg-white text-green-700 rounded-xl font-display font-bold text-[10px] shadow-lg">
                      Claim Deal
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHero(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentHero ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentHero((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentHero((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile Search Bar and Categories - Only visible on mobile */}
        <div className="md:hidden bg-white px-5 pb-4">
          {/* Search Bar */}
          <div 
            onClick={() => navigate('/explore?focus=true')} 
            className="relative cursor-pointer mb-4"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search shops, food, services..."
              className="w-full bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-600 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
              readOnly
            />
          </div>

          {/* Top Offer Near You Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-gray-900">Top Offer Near You</h3>
            <button 
              onClick={() => navigate('/explore')}
              className="text-green-700 text-sm font-semibold flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  activeCat === cat.id 
                    ? 'bg-green-700 text-white shadow-md' 
                    : `${cat.bg} ${cat.color}`
                }`}
              >
                <cat.icon size={18} />
                <span className="font-display font-semibold text-sm">{cat.label}</span>
              </button>
            ))}
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
      </motion.div>
    </AppShell>
  );
}
