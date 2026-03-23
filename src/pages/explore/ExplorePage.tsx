import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, MapPin, Star, X, Filter, 
  ChevronRight, Map as MapIcon, LayoutGrid, List, Check, Store, Navigation
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MERCHANTS, CATEGORIES } from '@/data/mockData';
import { useOffers } from '@/hooks/useOffers';
import AppShell from '@/components/layout/AppShell';
import OfferCard from '@/components/offers/OfferCard';
import CategoryGrid from '@/components/offers/CategoryGrid';
import MerchantCard from '@/components/offers/MerchantCard';
import EmptyState from '@/components/ui/EmptyState';
import { Slider } from '@/components/ui/slider';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const listVariants = { animate: { transition: { staggerChildren: 0.07 } } };

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);
  return null;
}

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'offers' | 'merchants'>('offers');
  const [isMapView, setIsMapView] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [distance, setDistance] = useState([10]);
  const [minRating, setMinRating] = useState(0);
  const [userLocation, setUserLocation] = useState<[number, number]>([26.5239, 93.9592]);
  const sortedOffers = useOffers(activeCat, debouncedSearch);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

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

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories Vertical List */}
      <div>
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
              {activeCat === cat.id ? <Check size={14} /> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Slider */}
      <div>
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
  );

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}>
        <div className="md:flex md:gap-8 max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0 sticky top-24 self-start">
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
              <FilterContent />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 pb-24">
            {/* Header and Search */}
            <div className="pt-4 mb-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="font-display font-bold text-3xl md:text-5xl text-app-text tracking-tight">Explore</h1>
                  <p className="text-app-muted text-sm md:text-base mt-1 font-medium">Discover local gems and unbeatable deals</p>
                </div>
                
                {/* Desktop View Toggles */}
                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={() => setIsMapView(!isMapView)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all border shadow-sm ${
                      isMapView ? 'bg-green-700 border-green-700 text-white' : 'bg-white border-gray-100 text-gray-600 hover:border-green-200'
                    }`}
                  >
                    {isMapView ? <LayoutGrid size={18} /> : <MapIcon size={18} />}
                    {isMapView ? 'Show Grid' : 'Show Map'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus={searchParams.get('focus') === 'true'}
                    placeholder="Search places, offers or services..."
                    className="w-full bg-white py-4 md:py-5 pl-14 pr-6 text-sm md:text-base text-app-text rounded-[24px] border border-gray-100 shadow-soft outline-none focus:ring-4 focus:ring-green-100 focus:border-green-600 transition-all"
                  />
                </div>
                
                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl w-fit self-center">
                  {(['offers', 'merchants'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-display font-bold transition-all capitalize ${
                        viewMode === mode ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map View or Grid View */}
            <AnimatePresence mode="wait">
              {isMapView ? (
                <motion.div
                  key="map-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="relative h-[600px] bg-slate-100 rounded-[40px] overflow-hidden border border-slate-200 shadow-inner z-0"
                >
                  <MapContainer 
                    center={userLocation} 
                    zoom={14} 
                    className="h-full w-full z-0"
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <RecenterMap coords={userLocation} />

                    {/* User Location Marker */}
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="font-display font-bold text-green-700">Your Location</div>
                      </Popup>
                    </Marker>

                    {/* Merchant Markers */}
                    {filteredMerchants.map((m) => (
                      m.lat && m.lng && (
                        <Marker key={m.id} position={[m.lat, m.lng]}>
                          <Popup className="merchant-popup">
                            <div className="w-48">
                              <img src={m.image} alt={m.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                              <h3 className="font-display font-bold text-slate-900">{m.name}</h3>
                              <p className="text-xs text-slate-500 mb-2">{m.address}</p>
                              <div className="flex items-center justify-between">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  {m.category.toUpperCase()}
                                </span>
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                  <Star size={10} fill="currentColor" />
                                  {m.rating}
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>

                  {/* Locate Me Button Overlay */}
                  <button
                    onClick={handleLocateMe}
                    className="absolute top-6 right-6 z-[400] bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-green-700 hover:bg-green-50 transition-all hover:scale-110 active:scale-95"
                    title="Get current location"
                  >
                    <Navigation size={20} />
                  </button>

                  {/* Map Overlays */}
                  <div className="absolute bottom-8 left-8 right-8 z-[400]">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {filteredMerchants.slice(0, 5).map(merchant => (
                        <div key={merchant.id} className="w-72 flex-shrink-0 snap-center">
                          <MerchantCard merchant={merchant} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
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
                        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
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
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {filteredMerchants.map(merchant => (
                          <MerchantCard key={merchant.id} merchant={merchant} />
                        ))}
                      </motion.div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Action Pill (Mobile Only) */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl border border-white/10 backdrop-blur-xl">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 font-display font-bold text-sm pr-4 border-r border-white/20"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
          <button 
            onClick={() => setIsMapView(!isMapView)}
            className="flex items-center gap-2 font-display font-bold text-sm pl-2"
          >
            {isMapView ? <LayoutGrid size={18} /> : <MapIcon size={18} />}
            {isMapView ? 'Grid' : 'Map'}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] z-[60] md:hidden overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-900">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                  <FilterContent />
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                  <button onClick={clearFilters} className="flex-1 py-4 font-display font-bold text-slate-500">Reset All</button>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-[2] py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-glow"
                  >
                    Show {viewMode === 'offers' ? sortedOffers.length : filteredMerchants.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
