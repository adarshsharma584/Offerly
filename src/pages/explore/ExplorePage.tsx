import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, Star, X, Filter, ChevronRight } from 'lucide-react';
import { MERCHANTS, CATEGORIES } from '@/data/mockData';
import { useOffers } from '@/hooks/useOffers';
import AppShell from '@/components/layout/AppShell';
import OfferCard from '@/components/offers/OfferCard';
import CategoryGrid from '@/components/offers/CategoryGrid';
import MerchantCard from '@/components/offers/MerchantCard';
import EmptyState from '@/components/ui/EmptyState';
import { Slider } from '@/components/ui/slider';

const listVariants = { animate: { transition: { staggerChildren: 0.07 } } };

const iconMap: Record<string, any> = {
  LayoutGrid: Search, // Fallback
  UtensilsCrossed: Filter,
  Scissors: Filter,
  Store: Filter,
  Dumbbell: Filter,
  Wrench: Filter,
  Pill: Filter,
  Smartphone: Filter,
  Shirt: Filter,
  Gamepad2: Filter,
};

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'offers' | 'merchants'>('offers');
  const [distance, setDistance] = useState([10]);
  const [minRating, setMinRating] = useState(0);
  const sortedOffers = useOffers(activeCat, debouncedSearch);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filteredMerchants = MERCHANTS.filter(m => {
    const matchesCat = activeCat === 'all' || m.category === activeCat;
    const matchesSearch = !debouncedSearch || m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || m.category.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesDistance = m.distance <= distance[0];
    const matchesRating = (m.rating || 0) >= minRating;
    return matchesCat && matchesSearch && matchesDistance && matchesRating;
  });

  const clearFilters = () => {
    setSearch('');
    setActiveCat('all');
    setDistance([10]);
    setMinRating(0);
  };

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}>
        <div className="md:flex md:gap-8">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <aside className="hidden md:block w-72 flex-shrink-0 sticky top-24 self-start space-y-8">
            <div className="glass-card p-6 rounded-3xl border border-white/40 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={18} className="text-green-700" />
                  Filters
                </h3>
                {(activeCat !== 'all' || distance[0] !== 10 || minRating !== 0) && (
                  <button onClick={clearFilters} className="text-[10px] font-bold text-red-500 hover:underline">Reset</button>
                )}
              </div>

              {/* Categories Vertical List */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                        activeCat === cat.id 
                          ? 'bg-green-50 text-green-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-semibold">{cat.label}</span>
                      <ChevronRight size={14} className={`transition-transform ${activeCat === cat.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Distance</h4>
                  <span className="text-xs font-bold text-green-700">{distance[0]} km</span>
                </div>
                <Slider 
                  value={distance} 
                  onValueChange={setDistance} 
                  max={20} 
                  step={1} 
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                  <span>0 km</span>
                  <span>20 km</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Min Rating</h4>
                <div className="flex gap-2">
                  {[0, 3, 4].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border transition-all ${
                        minRating === rating 
                          ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
                          : 'border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xs font-bold">{rating === 0 ? 'Any' : `${rating}★`}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header and Search */}
            <div className="px-5 md:px-0 pt-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="font-display font-bold text-2xl md:text-4xl text-app-text">Explore</h1>
                
                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl w-fit">
                  {(['offers', 'merchants'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-6 py-2 rounded-xl text-xs font-display font-bold transition-all capitalize ${
                        viewMode === mode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus={searchParams.get('focus') === 'true'}
                  placeholder="Search places, offers or services..."
                  className="w-full bg-white py-4 md:py-5 pl-14 pr-6 text-sm md:text-base text-app-text rounded-2xl border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-green-100 focus:border-green-600 transition-all"
                />
              </div>
            </div>

            {/* Mobile-only Category Chips */}
            <div className="md:hidden px-5 mb-6">
              <CategoryGrid activeCategory={activeCat} onSelect={setActiveCat} />
            </div>

            {/* Results Grid */}
            <div className="px-5 md:px-0">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-app-muted text-xs md:text-sm font-medium">
                  Showing <span className="text-gray-900 font-bold">{viewMode === 'offers' ? sortedOffers.length : filteredMerchants.length}</span> {viewMode}
                </p>
              </div>

              {viewMode === 'offers' ? (
                sortedOffers.length === 0 ? (
                  <EmptyState
                    title="No offers found"
                    description="Try different search terms or categories"
                    action={{ label: 'Clear filters', onClick: clearFilters }}
                  />
                ) : (
                  <motion.div 
                    variants={listVariants} 
                    initial="initial" 
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  >
                    {sortedOffers.map(offer => (
                      <OfferCard key={offer.id} offer={offer} merchant={MERCHANTS.find(m => m.id === offer.merchantId)} />
                    ))}
                  </motion.div>
                )
              ) : (
                filteredMerchants.length === 0 ? (
                  <EmptyState
                    title="No merchants found"
                    description="Try different search terms or categories"
                    action={{ label: 'Clear filters', onClick: clearFilters }}
                  />
                ) : (
                  <motion.div 
                    variants={listVariants} 
                    initial="initial" 
                    animate="animate"
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                  >
                    {filteredMerchants.map(merchant => (
                      <MerchantCard key={merchant.id} merchant={merchant} />
                    ))}
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
