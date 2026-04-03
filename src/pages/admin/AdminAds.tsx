import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Search, CheckCircle2, XCircle, Clock, Eye, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock ad data
const mockAds = [
  {
    id: '1',
    merchantName: 'Style Salon',
    title: 'Grand Opening - 50% Off All Services',
    description: 'Celebrate our grand opening with exclusive discounts on haircuts, styling, and spa treatments.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    budget: 5000,
    duration: '7 days',
    targetAudience: 'Women 18-45',
    status: 'pending',
    submittedDate: '2024-03-15',
    impressions: 0,
    clicks: 0,
  },
  {
    id: '2',
    merchantName: 'Fitness Hub',
    title: 'New Year Fitness Challenge',
    description: 'Join our 30-day fitness challenge and get 3 months free membership.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    budget: 8000,
    duration: '14 days',
    targetAudience: 'All ages',
    status: 'approved',
    submittedDate: '2024-03-10',
    impressions: 12500,
    clicks: 450,
  },
  {
    id: '3',
    merchantName: 'Spice Garden Restaurant',
    title: 'Weekend Special - Family Combo',
    description: 'Enjoy our special family combo meals at 40% off every weekend.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    budget: 3000,
    duration: '30 days',
    targetAudience: 'Families',
    status: 'pending',
    submittedDate: '2024-03-14',
    impressions: 0,
    clicks: 0,
  },
];

export default function AdminAds() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [ads, setAds] = useState(mockAds);

  const filteredAds = ads.filter(ad => {
    const matchesFilter = filter === 'all' || ad.status === filter;
    const matchesSearch = ad.merchantName.toLowerCase().includes(search.toLowerCase()) || 
                          ad.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, status } : ad));
    setSelectedAd(null);
  };

  const pendingCount = ads.filter(a => a.status === 'pending').length;
  const approvedCount = ads.filter(a => a.status === 'approved').length;
  const rejectedCount = ads.filter(a => a.status === 'rejected').length;

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Ad Approvals</h1>
            <p className="text-app-muted text-sm mt-1 font-medium">Review and approve merchant advertising campaigns</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2 rounded-xl text-[10px] md:text-xs font-display font-bold capitalize transition-all ${
                  filter === f ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Ads', count: ads.length, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: Megaphone },
            { label: 'Pending', count: pendingCount, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
            { label: 'Approved', count: approvedCount, color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
            { label: 'Rejected', count: rejectedCount, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
          ].map((stat) => (
            <div key={stat.label} className={`p-5 rounded-2xl ${stat.bg} border border-white flex items-center justify-between shadow-sm`}>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.text} mb-1`}>{stat.label}</p>
                <p className={`text-2xl font-display font-bold ${stat.text}`}>{stat.count}</p>
              </div>
              <stat.icon size={24} className={stat.text} />
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search ads by merchant or campaign title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-600 transition-all shadow-sm"
          />
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad, i) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedAd(ad)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ad.status === 'approved' ? 'bg-green-500 text-white' :
                  ad.status === 'pending' ? 'bg-amber-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {ad.status}
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{ad.merchantName}</p>
                <h3 className="font-display font-bold text-base text-gray-900 mb-2 line-clamp-2">{ad.title}</h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{ad.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-sm font-bold text-gray-900">₹{ad.budget.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{ad.duration}</p>
                  </div>
                </div>

                {ad.status === 'approved' && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye size={12} />
                      <span>{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp size={12} />
                      <span>{ad.clicks} clicks</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ad Detail Modal */}
        <AnimatePresence>
          {selectedAd && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setSelectedAd(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="relative h-64">
                  <img src={selectedAd.image} alt={selectedAd.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedAd(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                  >
                    <XCircle size={20} className="text-gray-600" />
                  </button>
                  <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedAd.status === 'approved' ? 'bg-green-500 text-white' :
                    selectedAd.status === 'pending' ? 'bg-amber-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {selectedAd.status}
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{selectedAd.merchantName}</p>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">{selectedAd.title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedAd.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className="text-green-600" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">₹{selectedAd.budget.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-600" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedAd.duration}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye size={16} className="text-purple-600" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Impressions</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedAd.impressions.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-orange-600" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clicks</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{selectedAd.clicks}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-blue-900 mb-1">Target Audience</p>
                    <p className="text-sm text-blue-700">{selectedAd.targetAudience}</p>
                  </div>

                  {selectedAd.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => handleStatusChange(selectedAd.id, 'approved')}
                        className="flex-1 py-4 bg-green-700 text-white rounded-xl font-display font-bold shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all"
                      >
                        Approve Campaign
                      </button>
                      <button 
                        onClick={() => handleStatusChange(selectedAd.id, 'rejected')}
                        className="flex-1 py-4 bg-red-50 text-red-600 rounded-xl font-display font-bold hover:bg-red-100 transition-all"
                      >
                        Reject Campaign
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredAds.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Megaphone size={32} />
            </div>
            <h3 className="text-lg font-display font-bold text-gray-900">No ads found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search term.</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
