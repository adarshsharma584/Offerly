import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Gift, Calendar, Users, ArrowRight, XCircle, Search, Sparkles, AlertCircle, Percent, Tag, Ticket, TrendingUp } from 'lucide-react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function MerchantOffers() {
  const { user } = useAuth();
  const { data, updateOffer, addOffer } = usePlatformData();
  const { offers, merchants } = data;
  const currentMerchant = merchants.find(m => m.id === user?.id) || merchants.find(m => m.name === user?.businessName);
  const merchantId = currentMerchant?.id || user?.id || '';
  const merchantOffers = offers.filter(o => o.merchantId === merchantId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    desc: '',
    type: 'percent',
    value: '',
    validTill: '',
    terms: ''
  });

  const toggleStatus = (id: string) => {
    const offer = offers.find(o => o.id === id);
    if (offer) {
      updateOffer(id, { status: offer.status === 'active' ? 'paused' : 'active' });
      toast.success(`Offer ${offer.status === 'active' ? 'paused' : 'activated'}`);
    }
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offer = {
      id: `O${Date.now()}`,
      merchantId,
      ...newOffer,
      value: Number(newOffer.value),
      uses: 0,
      status: 'active'
    };
    addOffer(offer);
    setShowAddModal(false);
    setNewOffer({ title: '', desc: '', type: 'percent', value: '', validTill: '', terms: '' });
    toast.success('New offer created successfully!');
  };

  const getOfferIcon = (type: string) => {
    switch(type) {
      case 'percent': return <Percent size={14} />;
      case 'flat': return <Tag size={14} />;
      case 'bogo': return <Ticket size={14} />;
      default: return <Gift size={14} />;
    }
  };

  return (
    <MerchantLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-app-text tracking-tight">Offer Management</h1>
            <p className="text-app-muted text-sm mt-1 font-medium">Create and monitor your store's active deals</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white rounded-[20px] font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all hover:-translate-y-1"
          >
            <Plus size={20} />
            Create New Offer
          </button>
        </div>

        {/* Stats Summary - 3 Cards for Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[28px] border border-green-50 shadow-sm flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-green-100">
              <Gift size={26} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] mb-1">Active Offers</p>
              <p className="text-2xl font-display font-bold text-app-text">{merchantOffers.filter(o => o.status === 'active').length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[28px] border border-blue-50 shadow-sm flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-blue-100">
              <Users size={26} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] mb-1">Total Reach</p>
              <p className="text-2xl font-display font-bold text-app-text">{merchantOffers.reduce((acc, o) => acc + (o.uses || 0), 0)} Users</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[28px] border border-amber-50 shadow-sm flex items-center gap-5 group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-amber-100">
              <TrendingUp size={26} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] mb-1">Avg. Redemption</p>
              <p className="text-2xl font-display font-bold text-app-text">84%</p>
            </div>
          </div>
        </div>

        {/* Offers Grid - Responsive Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {merchantOffers.map((offer, i) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[32px] border border-app-border shadow-xl shadow-black/[0.02] overflow-hidden group hover:border-green-700/30 transition-all hover:shadow-2xl hover:shadow-green-900/5 relative"
            >
              {/* Offer Type Badge - Desktop Feature */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-2 rounded-xl shadow-sm text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all">
                  {getOfferIcon(offer.type)}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    offer.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {offer.status}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-app-muted hover:bg-app-bg rounded-xl transition-all"><Edit3 size={16} /></button>
                    <button className="p-2 text-app-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-app-text group-hover:text-green-700 transition-colors leading-tight">{offer.title}</h3>
                  <p className="text-sm text-app-muted mt-2 leading-relaxed line-clamp-2">{offer.desc}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 py-5 border-y border-gray-50">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.15em] mb-1.5">Benefit</p>
                    <p className="text-sm font-display font-bold text-green-700">{offer.type === 'percent' ? `${offer.value}% OFF` : offer.type === 'bogo' ? 'BOGO' : `₹${offer.value} OFF`}</p>
                  </div>
                  <div className="text-center border-x border-gray-100 px-2">
                    <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.15em] mb-1.5">Redeemed</p>
                    <p className="text-sm font-display font-bold text-app-text">{offer.uses || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-app-muted uppercase tracking-[0.15em] mb-1.5">Validity</p>
                    <p className="text-sm font-display font-bold text-app-text">{new Date(offer.validTill).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added 2 days ago</span>
                  </div>
                  <button 
                    onClick={() => toggleStatus(offer.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all shadow-sm ${
                      offer.status === 'active' 
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {offer.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {offer.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {merchantOffers.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-app-border flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-app-bg rounded-full flex items-center justify-center mb-6 text-app-muted">
                <Gift size={40} />
              </div>
              <h3 className="text-xl font-display font-bold text-app-text">No active offers yet</h3>
              <p className="text-app-muted text-sm mt-2 max-w-sm">Create your first deal to start attracting local customers to your store.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-8 px-8 py-3 bg-green-700 text-white rounded-2xl font-display font-bold shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Add Offer Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0B2519]/60 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl"
              >
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-app-text">Create New Offer</h2>
                      <p className="text-app-muted text-sm mt-1">Fill in the details for your new deal</p>
                    </div>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="w-10 h-10 bg-app-bg rounded-full flex items-center justify-center text-app-muted hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleAddOffer} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-widest ml-4 mb-2 block">Offer Title</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. 50% OFF on all pizzas"
                          value={newOffer.title}
                          onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                          className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-widest ml-4 mb-2 block">Short Description</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Valid on all dine-in orders above ₹500"
                          value={newOffer.desc}
                          onChange={e => setNewOffer({...newOffer, desc: e.target.value})}
                          className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-app-muted uppercase tracking-widest ml-4 mb-2 block">Offer Type</label>
                          <select 
                            value={newOffer.type}
                            onChange={e => setNewOffer({...newOffer, type: e.target.value})}
                            className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all appearance-none"
                          >
                            <option value="percent">Percentage OFF</option>
                            <option value="flat">Flat Amount OFF</option>
                            <option value="bogo">Buy 1 Get 1</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-app-muted uppercase tracking-widest ml-4 mb-2 block">Value</label>
                          <input 
                            required
                            type="number" 
                            placeholder="e.g. 30"
                            value={newOffer.value}
                            onChange={e => setNewOffer({...newOffer, value: e.target.value})}
                            className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-widest ml-4 mb-2 block">Valid Till</label>
                        <input 
                          required
                          type="date" 
                          value={newOffer.validTill}
                          onChange={e => setNewOffer({...newOffer, validTill: e.target.value})}
                          className="w-full bg-app-bg border border-app-border rounded-2xl py-4 px-6 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                      <p className="text-[11px] font-medium text-amber-900 leading-relaxed">
                        Your offer will be live immediately but will be reviewed by our team for quality compliance.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all"
                    >
                      Publish Offer
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MerchantLayout>
  );
}
