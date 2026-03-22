import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Calendar, Trash2, User as UserIcon, Eye } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { usePlatformData } from '@/context/PlatformDataContext';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const { data } = usePlatformData();
  const users = data.users;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.phone.includes(search)
  );

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-app-text">User Management</h1>
            <p className="text-app-muted text-sm mt-1">Manage platform users and monitor engagement</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-app-border shadow-sm flex items-center gap-3">
            <Users size={20} className="text-green-700" />
            <span className="text-sm font-display font-bold text-app-text">{users.length} Total Users</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-green-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-app-border rounded-2xl py-4 pl-12 pr-4 font-display font-bold text-app-text focus:outline-none focus:ring-4 focus:ring-green-700/5 transition-all shadow-sm"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[32px] border border-app-border shadow-xl shadow-black/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-app-border bg-app-bg/50">
                  <th className="px-6 py-5 font-display font-bold text-xs text-app-muted uppercase tracking-wider">User</th>
                  <th className="px-6 py-5 font-display font-bold text-xs text-app-muted uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-5 font-display font-bold text-xs text-app-muted uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-5 font-display font-bold text-xs text-app-muted uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-5 font-display font-bold text-xs text-app-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {filteredUsers.map((u, i) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-app-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-app-bg flex items-center justify-center text-app-muted">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-app-text">{u.name}</p>
                          <p className="text-[10px] text-app-muted font-bold uppercase tracking-widest">{u.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-app-text">
                          <Phone size={12} className="text-app-muted" />
                          {u.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-app-muted">
                          <Mail size={12} />
                          {u.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Uses</p>
                          <p className="text-xs font-display font-bold text-app-text">{u.offersUsed || 0}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Savings</p>
                          <p className="text-xs font-display font-bold text-green-700">₹{u.totalSavings || 0}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-app-text">
                        <Calendar size={12} className="text-app-muted" />
                        {u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-app-bg text-app-muted rounded-xl hover:bg-green-700 hover:text-white transition-all shadow-sm">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-app-muted hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-app-border">
            <div className="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center mx-auto mb-4 text-app-muted">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-display font-bold text-app-text">No users found</h3>
            <p className="text-app-muted text-sm mt-1">Try a different search term.</p>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
