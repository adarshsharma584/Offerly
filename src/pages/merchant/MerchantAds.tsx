import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Sparkles, Image as ImageIcon, Target, 
  Calendar, CreditCard, ChevronRight, AlertCircle,
  CheckCircle2, Clock, Megaphone, TrendingUp, BarChart3
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';

export default function MerchantAds() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ads, setAds] = useState([
    { 
      id: 'ad1', 
      title: 'Summer Splash Sale', 
      status: 'active', 
      reach: 1240, 
      clicks: 85, 
      budget: 5000, 
      spent: 1200,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'
    },
    { 
      id: 'ad2', 
      title: 'Weekend Brunch Special', 
      status: 'pending', 
      reach: 0, 
      clicks: 0, 
      budget: 2000, 
      spent: 0,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop'
    }
  ]);

  const [newAd, setNewAd] = useState({
    title: '',
    target: 'all',
    duration: '7',
    budget: ''
  });

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const ad = {
      id: `ad${Date.now()}`,
      ...newAd,
      status: 'pending',
      reach: 0,
      clicks: 0,
      spent: 0,
      budget: Number(newAd.budget),
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop'
    };
    setAds([ad as any, ...ads]);
    setShowCreateModal(false);
    toast.success('Ad campaign submitted for approval!');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'paused': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">Ads Manager</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Boost your visibility and reach more local customers</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white rounded-[20px] font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all hover:-translate-y-1"
          >
            <Plus size={20} />
            Create Ad Campaign
          </button>
        </div>

        {/* Ad Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Impressions', value: '5,240', icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Click Rate (CTR)', value: '4.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Ad Credits', value: '₹12,400', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-sm`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Ads List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="font-display font-bold text-xl text-slate-900">Your Ad Campaigns</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {ads.map(ad => (
              <div key={ad.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-display font-bold text-xl text-slate-900">{ad.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(ad.status)}`}>
                      {ad.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Impressions</p>
                      <p className="font-display font-bold text-slate-700">{ad.reach.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clicks</p>
                      <p className="font-display font-bold text-slate-700">{ad.clicks}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</p>
                      <p className="font-display font-bold text-green-700">₹{ad.budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Spent</p>
                      <p className="font-display font-bold text-slate-900">₹{ad.spent}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  {ad.status === 'active' && (
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-display font-bold text-xs hover:bg-slate-200 transition-colors">
                      <BarChart3 size={14} /> View Analytics
                    </button>
                  )}
                  {ad.status === 'pending' && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl">
                      <Clock size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">Under Review</span>
                    </div>
                  )}
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl font-display font-bold text-xs hover:bg-slate-50 transition-colors">
                    Manage Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Ad Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden relative shadow-2xl"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">Launch New Ad</h3>
                    <p className="text-slate-500 text-xs">Reach thousands of nearby customers</p>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                  <AlertCircle size={24} className="text-slate-300" />
                </button>
              </div>

              <form onSubmit={handleCreateAd} className="p-8 space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Campaign Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Grand Opening Special"
                      value={newAd.title}
                      onChange={e => setNewAd({...newAd, title: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-green-700/20 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Target Audience</label>
                      <select 
                        value={newAd.target}
                        onChange={e => setNewAd({...newAd, target: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
                      >
                        <option value="all">Everyone Nearby</option>
                        <option value="new">New Customers</option>
                        <option value="regular">Regular Visitors</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                      <select 
                        value={newAd.duration}
                        onChange={e => setNewAd({...newAd, duration: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
                      >
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Budget (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 5000"
                      value={newAd.budget}
                      onChange={e => setNewAd({...newAd, budget: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-green-700/20 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-green-50 rounded-3xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm flex-shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-green-800">Estimated Reach</p>
                    <p className="text-green-700/80 text-xs mt-1">Based on your budget, this ad could reach approximately 2,500 - 4,000 customers in your city.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-display font-bold hover:bg-slate-100 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all"
                  >
                    Pay & Launch Ad
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
