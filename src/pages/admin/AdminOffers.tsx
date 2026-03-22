import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Search, Filter, CheckCircle2, XCircle, Clock, Store, Tag, Calendar, MoreVertical, Trash2, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { toast } from 'sonner';

export default function AdminOffers() {
  const { data, updateOffer } = usePlatformData();
  const { offers, merchants } = data;
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'paused'>('all');
  const [search, setSearch] = useState('');

  const filteredOffers = offers.filter(o => {
    const merchant = merchants.find(m => m.id === o.merchantId);
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                          merchant?.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateOffer(id, { status });
    toast.success(`Offer status updated to ${status}`);
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-app-text">Global Offers</h1>
            <p className="text-app-muted text-sm mt-1">Monitor and manage all active deals across the platform</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-app-border shadow-sm">
            {['all', 'active', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold capitalize transition-all ${
                  filter === f ? 'bg-green-700 text-white shadow-lg' : 'text-app-muted hover:bg-app-bg'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-green-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by offer title or merchant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-app-border rounded-2xl py-4 pl-12 pr-4 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all shadow-sm"
          />
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, i) => {
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

                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-app-border/50">
                    <div>
                      <p className="text-[9px] font-bold text-app-muted uppercase tracking-wider mb-1">Value</p>
                      <p className="text-xs font-display font-bold text-green-700">
                        {offer.type === 'percent' ? `${offer.value}% OFF` : offer.type === 'bogo' ? 'BOGO' : `₹${offer.value} OFF`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-app-muted uppercase tracking-wider mb-1">Uses</p>
                      <p className="text-xs font-display font-bold text-app-text">{offer.uses} Times</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-app-muted">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">{new Date(offer.validTill).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {offer.status === 'pending' ? (
                        <button 
                          onClick={() => handleStatusChange(offer.id, 'active')}
                          className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition-all shadow-sm"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      ) : (
                        <button className="p-2 bg-app-bg text-app-muted rounded-xl hover:bg-green-700 hover:text-white transition-all shadow-sm">
                          <Eye size={14} />
                        </button>
                      )}
                      <button className="p-2 text-app-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredOffers.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-app-border">
            <div className="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center mx-auto mb-4 text-app-muted">
              <Gift size={32} />
            </div>
            <h3 className="text-lg font-display font-bold text-app-text">No offers found</h3>
            <p className="text-app-muted text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
