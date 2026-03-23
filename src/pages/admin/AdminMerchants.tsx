import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Search, Filter, CheckCircle2, XCircle, Clock, MapPin, Phone, Star, ShieldCheck, ChevronRight, MoreHorizontal, AlertCircle, Eye, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';

export default function AdminMerchants() {
  const { data, updateMerchant } = usePlatformData();
  const { merchants } = data;
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);

  const filteredMerchants = merchants.filter(m => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.city.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateMerchant(id, { status, isVerified: status === 'verified' });
    if (selectedMerchant?.id === id) setSelectedMerchant(null);
  };

  return (
    <DashboardLayout role="admin">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Merchant Directory</h1>
            <p className="text-app-muted text-sm mt-1 font-medium">Manage and approve local business partners</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
            {['all', 'pending', 'verified', 'rejected'].map(f => (
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

        {/* Enhanced Stats Bar - 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: merchants.length, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
            { label: 'Verified', count: merchants.filter(m => m.status === 'verified').length, color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'Pending', count: merchants.filter(m => m.status === 'pending').length, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
            { label: 'Rejected', count: merchants.filter(m => m.status === 'rejected').length, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
          ].map((stat) => (
            <div key={stat.label} className={`p-4 rounded-[20px] ${stat.bg} border border-white flex items-center justify-between shadow-sm`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${stat.color} animate-pulse`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.text}`}>{stat.label}</span>
              </div>
              <span className={`text-xl font-display font-bold ${stat.text}`}>{stat.count}</span>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search merchants by name, city, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-14 pr-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-600 transition-all shadow-sm"
          />
        </div>

        <div className="flex gap-8 items-start">
          {/* Merchant Table */}
          <div className="flex-1 bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 font-display font-bold text-[10px] text-app-muted uppercase tracking-[0.15em]">Business</th>
                    <th className="px-8 py-5 font-display font-bold text-[10px] text-app-muted uppercase tracking-[0.15em]">Category</th>
                    <th className="px-8 py-5 font-display font-bold text-[10px] text-app-muted uppercase tracking-[0.15em]">City</th>
                    <th className="px-8 py-5 font-display font-bold text-[10px] text-app-muted uppercase tracking-[0.15em]">Status</th>
                    <th className="px-8 py-5 font-display font-bold text-[10px] text-app-muted uppercase tracking-[0.15em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredMerchants.map((m, i) => (
                    <motion.tr 
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setSelectedMerchant(m)}
                      className={`group cursor-pointer transition-all ${selectedMerchant?.id === m.id ? 'bg-green-50/50' : 'hover:bg-gray-50/50'}`}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-white shadow-sm group-hover:scale-105 transition-transform">
                            {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <Store size={20} className="text-gray-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{m.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{m.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-widest">{m.category}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <MapPin size={14} className="text-green-600" />
                          {m.city}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'approved' ? 'bg-green-100 text-green-700' :
                          m.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            m.status === 'approved' ? 'bg-green-600' :
                            m.status === 'pending' ? 'bg-amber-600' :
                            'bg-red-600'
                          }`} />
                          {m.status}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <ChevronRight size={18} className={`inline transition-transform ${selectedMerchant?.id === m.id ? 'translate-x-1 text-green-700' : 'text-gray-300 group-hover:translate-x-1'}`} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Merchant Quick Preview Panel - Laptop Feature */}
          <AnimatePresence>
            {selectedMerchant && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden xl:block w-96 flex-shrink-0 sticky top-24 space-y-6"
              >
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-green-800 to-green-700 relative">
                    <button onClick={() => setSelectedMerchant(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"><XCircle size={20} /></button>
                    <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-3xl bg-white p-1 shadow-lg border border-gray-50">
                      <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                        {selectedMerchant.image ? <img src={selectedMerchant.image} alt="" className="w-full h-full object-cover" /> : <Store size={28} className="text-gray-300" />}
                      </div>
                    </div>
                  </div>
                  <div className="pt-14 px-8 pb-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
                        {selectedMerchant.name}
                        {selectedMerchant.isVerified && <ShieldCheck size={20} className="text-green-600" />}
                      </h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">{selectedMerchant.category} · {selectedMerchant.city}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                        <p className="text-sm font-bold text-gray-900">{selectedMerchant.distance}m away</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span className="text-sm font-bold text-gray-900">{selectedMerchant.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0"><MapPin size={18} /></div>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">{selectedMerchant.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0"><Phone size={18} /></div>
                        <p className="text-xs font-bold text-gray-900">{selectedMerchant.phone}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex gap-3">
                      {selectedMerchant.status === 'pending' ? (
                        <>
                          <button onClick={() => handleStatusChange(selectedMerchant.id, 'approved')} className="flex-1 py-3 bg-green-700 text-white rounded-xl font-display font-bold text-xs shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all">Approve</button>
                          <button onClick={() => handleStatusChange(selectedMerchant.id, 'rejected')} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-display font-bold text-xs hover:bg-red-100 transition-all">Reject</button>
                        </>
                      ) : (
                        <button onClick={() => handleStatusChange(selectedMerchant.id, selectedMerchant.status === 'approved' ? 'rejected' : 'approved')} className={`w-full py-3 rounded-xl font-display font-bold text-xs transition-all ${selectedMerchant.status === 'approved' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                          {selectedMerchant.status === 'approved' ? 'Suspend Merchant' : 'Re-Approve'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* Detailed Merchant View Modal (Mobile Only) */}
        <AnimatePresence>
          {selectedMerchant && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 z-50 bg-[#0B2519]/60 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative"
              >
                <button 
                  onClick={() => setSelectedMerchant(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-app-bg rounded-full flex items-center justify-center text-app-muted hover:bg-red-50 hover:text-red-600 transition-all z-10"
                >
                  <XCircle size={24} />
                </button>

                <div className="h-48 bg-gradient-to-br from-[#0B2519] to-[#1B4332] relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                  {selectedMerchant.image && (
                    <img src={selectedMerchant.image} alt="" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                  )}
                  <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-[32px] bg-white p-1.5 shadow-xl border border-app-border">
                    <div className="w-full h-full rounded-[24px] bg-app-bg flex items-center justify-center overflow-hidden">
                      {selectedMerchant.image ? (
                        <img src={selectedMerchant.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={32} className="text-app-muted" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-16 px-10 pb-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-app-text flex items-center gap-3">
                        {selectedMerchant.name}
                        {selectedMerchant.isVerified && <ShieldCheck size={20} className="text-green-600" />}
                      </h2>
                      <p className="text-app-muted text-sm mt-1">{selectedMerchant.category.toUpperCase()} · {selectedMerchant.city}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                      <Star size={14} className="fill-amber-700" />
                      {selectedMerchant.rating}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-app-text">
                        <div className="w-9 h-9 rounded-xl bg-app-bg flex items-center justify-center text-app-muted">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Address</p>
                          <p className="text-sm font-medium">{selectedMerchant.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-app-text">
                        <div className="w-9 h-9 rounded-xl bg-app-bg flex items-center justify-center text-app-muted">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Phone</p>
                          <p className="text-sm font-medium">{selectedMerchant.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-app-bg p-4 rounded-3xl border border-app-border">
                        <p className="text-[10px] font-bold text-app-muted uppercase tracking-wider mb-2">Performance</p>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">Active Offers</span>
                          <span className="text-sm font-bold text-green-700">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Total Sales</span>
                          <span className="text-sm font-bold text-green-700">₹24.5K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all">
                      View All Offers
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedMerchant.id, selectedMerchant.status === 'approved' ? 'rejected' : 'approved')}
                      className={`flex-1 py-4 rounded-2xl font-display font-bold border-2 transition-all ${
                        selectedMerchant.status === 'approved' 
                          ? 'border-red-100 text-red-600 hover:bg-red-50' 
                          : 'border-green-100 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {selectedMerchant.status === 'approved' ? 'Suspend Merchant' : 'Approve Merchant'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
