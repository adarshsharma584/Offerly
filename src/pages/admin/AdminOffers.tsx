import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Search, Filter, CheckCircle2, XCircle, Clock, Store, Tag, Calendar, MoreVertical, Trash2, Eye, ShieldCheck, AlertCircle, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { toast } from 'sonner';

export default function AdminOffers() {
  const { data, updateOffer } = usePlatformData();
  const { offers, merchants } = data;
  const [activeTab, setActiveTab] = useState<'offers' | 'ads'>('offers');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'paused'>('pending');
  const [search, setSearch] = useState('');

  // Mock Ads for Approval (In a real app, this would come from platform data)
  const [ads, setAds] = useState([
    { id: 'ad_1', merchantId: 'M001', title: 'Weekend Bonanza', type: 'Banner', status: 'pending', budget: 5000, createdAt: '2026-03-22T10:00:00Z' },
    { id: 'ad_2', merchantId: 'M002', title: 'New Menu Launch', type: 'Featured', status: 'pending', budget: 3500, createdAt: '2026-03-22T11:30:00Z' },
  ]);

  const filteredOffers = offers.filter(o => {
    const merchant = merchants.find(m => m.id === o.merchantId);
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                          merchant?.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredAds = ads.filter(ad => {
    const merchant = merchants.find(m => m.id === ad.merchantId);
    const matchesFilter = filter === 'all' || ad.status === filter;
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) || 
                          merchant?.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateOffer(id, { status });
    toast.success(`Offer status updated to ${status}`);
  };

  const handleAdStatusChange = (id: string, status: string) => {
    setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status } : ad));
    toast.success(`Ad status updated to ${status}`);
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-app-text">Approval Workflow</h1>
            <p className="text-app-muted text-sm mt-1">Unified queue for pending Offers and Advertisements</p>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                activeTab === 'offers' ? 'bg-white text-green-700 shadow-sm' : 'text-app-muted hover:bg-white/50'
              }`}
            >
              Offers ({offers.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                activeTab === 'ads' ? 'bg-white text-green-700 shadow-sm' : 'text-app-muted hover:bg-white/50'
              }`}
            >
              Ads ({ads.filter(a => a.status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-green-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-app-border rounded-2xl py-4 pl-12 pr-4 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-app-border shadow-sm">
            {['pending', 'active', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold capitalize transition-all ${
                  filter === f ? 'bg-green-700 text-white shadow-lg' : 'text-app-muted hover:bg-app-bg'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'offers' ? (
            filteredOffers.map((offer, i) => {
              const merchant = merchants.find(m => m.id === offer.merchantId);
              return (
                <motion.div 
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[32px] border border-app-border shadow-xl shadow-black/[0.02] overflow-hidden group hover:border-green-700/30 transition-all"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-app-bg flex items-center justify-center text-app-muted">
                          <Store size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest truncate max-w-[120px]">
                          {merchant?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        offer.status === 'active' ? 'bg-green-50 text-green-700' : 
                        offer.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {offer.status}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-display font-bold text-app-text leading-tight group-hover:text-green-700 transition-colors line-clamp-2">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-app-muted mt-2 line-clamp-2 leading-relaxed">
                        {offer.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-green-700 font-display font-bold text-sm">
                        <Tag size={14} />
                        {offer.type === 'percent' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                      </div>
                      <div className="flex items-center gap-2">
                        {offer.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(offer.id, 'rejected')}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <XCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(offer.id, 'active')}
                              className="p-2.5 bg-green-700 text-white rounded-xl shadow-lg shadow-green-900/10 hover:bg-green-800 transition-all"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            filteredAds.map((ad, i) => {
              const merchant = merchants.find(m => m.id === ad.merchantId);
              return (
                <motion.div 
                  key={ad.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[32px] border border-app-border shadow-xl shadow-black/[0.02] overflow-hidden group hover:border-green-700/30 transition-all"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Store size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest truncate max-w-[120px]">
                          {merchant?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        ad.status === 'active' ? 'bg-green-50 text-green-700' : 
                        ad.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {ad.status}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-display font-bold text-app-text leading-tight group-hover:text-green-700 transition-colors line-clamp-2">
                        {ad.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{ad.type}</span>
                        <span className="text-[10px] font-bold text-app-muted flex items-center gap-1"><Calendar size={10} /> {new Date(ad.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-blue-700 font-display font-bold text-sm">
                        <DollarSign size={14} />
                        Budget: ₹{ad.budget}
                      </div>
                      <div className="flex items-center gap-2">
                        {ad.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAdStatusChange(ad.id, 'rejected')}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <XCircle size={18} />
                            </button>
                            <button 
                              onClick={() => handleAdStatusChange(ad.id, 'active')}
                              className="p-2.5 bg-green-700 text-white rounded-xl shadow-lg shadow-green-900/10 hover:bg-green-800 transition-all"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {(activeTab === 'offers' ? filteredOffers.length : filteredAds.length) === 0 && (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-app-border flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-app-bg rounded-full flex items-center justify-center mb-6 text-app-muted">
                {activeTab === 'offers' ? <Gift size={40} /> : <Store size={40} />}
              </div>
              <h3 className="text-xl font-display font-bold text-app-text">No pending {activeTab}</h3>
              <p className="text-app-muted text-sm mt-2 max-w-sm">Everything is up to date! New {activeTab} will appear here for your approval.</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
