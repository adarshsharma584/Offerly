import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Shield, ShieldCheck, Mail, Phone, 
  Trash2, Edit3, X, Check, Search, Filter, 
  ChevronRight, AlertCircle, MessageSquare, Gift, Store, Megaphone
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { SubAdminCategory } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function AdminSubAdmins() {
  const { data, updateUser } = usePlatformData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  
  // Mock Sub-Admins (In real app, filter users by role === 'sub_admin')
  const [subAdmins, setSubAdmins] = useState([
    { id: 'sa1', name: 'Adarsh Kashyap', email: 'adarsh@offerly.in', phone: '+91 98765 43210', category: 'support', status: 'active', joinedDate: '2026-01-15' },
    { id: 'sa2', name: 'Priya Das', email: 'priya@offerly.in', phone: '+91 87654 32109', category: 'merchant_mgmt', status: 'active', joinedDate: '2026-02-10' },
    { id: 'sa3', name: 'Rahul Boro', email: 'rahul@offerly.in', phone: '+91 76543 21098', category: 'offer_mgmt', status: 'paused', joinedDate: '2026-03-05' },
  ]);

  const [newSA, setNewSA] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'support' as SubAdminCategory
  });

  const handleAddSA = (e: React.FormEvent) => {
    e.preventDefault();
    const sa = {
      id: `sa${Date.now()}`,
      ...newSA,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setSubAdmins([sa as any, ...subAdmins]);
    setShowAddModal(false);
    setNewSA({ name: '', email: '', phone: '', category: 'support' });
    toast.success('New sub-admin created successfully!');
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'support': return <MessageSquare size={14} />;
      case 'merchant_mgmt': return <Store size={14} />;
      case 'offer_mgmt': return <Gift size={14} />;
      case 'ad_mgmt': return <Megaphone size={14} />;
      default: return <Shield size={14} />;
    }
  };

  const filteredSAs = subAdmins.filter(sa => 
    sa.name.toLowerCase().includes(search.toLowerCase()) || 
    sa.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 tracking-tight">Staff Management</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Assign roles and categories to your platform administrators</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white rounded-[20px] font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all hover:-translate-y-1"
          >
            <UserPlus size={20} />
            Add New Staff
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Staff', value: subAdmins.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Sessions', value: '8', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Tasks', value: '45', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
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

        {/* Search & List */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-display font-bold text-xl text-slate-900">Platform Administrators</h3>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search staff by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 font-display font-bold text-sm text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSAs.map(sa => (
                  <tr key={sa.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-display font-bold text-slate-400 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                          {sa.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-slate-900">{sa.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{sa.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl w-fit text-xs font-bold capitalize">
                        {getCategoryIcon(sa.category)}
                        {sa.category.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                        sa.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {sa.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-medium text-slate-500">{sa.joinedDate}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:bg-white hover:text-green-700 rounded-xl transition-all shadow-sm">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden relative shadow-2xl"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">Add Staff Member</h3>
                    <p className="text-slate-500 text-xs">Create a new sub-admin account</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-300 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSA} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Full Name</label>
                    <input 
                      type="text" required placeholder="e.g. Adarsh Kashyap"
                      value={newSA.name} onChange={e => setNewSA({...newSA, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Email</label>
                      <input 
                        type="email" required placeholder="staff@offerly.in"
                        value={newSA.email} onChange={e => setNewSA({...newSA, email: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Phone</label>
                      <input 
                        type="tel" required placeholder="+91 00000 00000"
                        value={newSA.phone} onChange={e => setNewSA({...newSA, phone: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Assign Category</label>
                    <select 
                      value={newSA.category} 
                      onChange={e => setNewSA({...newSA, category: e.target.value as any})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-display font-bold text-slate-900 focus:ring-2 focus:ring-green-700/20 outline-none appearance-none"
                    >
                      <option value="support">Customer Support</option>
                      <option value="merchant_mgmt">Merchant Management</option>
                      <option value="offer_mgmt">Offer Management</option>
                      <option value="ad_mgmt">Ad Management</option>
                      <option value="feedback">Feedback & Reviews</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-3xl p-6 flex items-start gap-4 border border-amber-100/50">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm flex-shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-amber-800">Permissions Note</p>
                    <p className="text-amber-700/80 text-[10px] mt-1 leading-relaxed">This staff member will only have access to their assigned category. Global platform settings will remain restricted.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-display font-bold hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all"
                  >
                    Create Account
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
