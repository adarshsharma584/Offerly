import { motion } from 'framer-motion';
import { Settings, Shield, Bell, DollarSign, Database, LayoutGrid, ArrowRight, Save, Globe, Lock } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from 'sonner';

export default function AdminSettings() {
  const settingsGroups = [
    {
      title: 'Platform Branding',
      icon: Globe,
      items: [
        { label: 'App Configuration', desc: 'App name, logo, primary colors', icon: LayoutGrid },
        { label: 'Domain Settings', desc: 'Custom domains and SSL', icon: Globe },
      ]
    },
    {
      title: 'Monetization',
      icon: DollarSign,
      items: [
        { label: 'Ad Tier Pricing', desc: 'Configure Premium, Growth, Starter pricing', icon: DollarSign },
        { label: 'Commission Rates', desc: 'Set global transaction fees', icon: Database },
      ]
    },
    {
      title: 'Security & Access',
      icon: Shield,
      items: [
        { label: 'Admin Roles', desc: 'Manage sub-admin permissions', icon: Shield },
        { label: 'API Keys', desc: 'Manage external integration keys', icon: Lock },
      ]
    },
    {
      title: 'Communications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', desc: 'Firebase and SMS templates', icon: Bell },
      ]
    }
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-app-text">System Settings</h1>
            <p className="text-app-muted text-sm mt-1">Configure global platform parameters and rules</p>
          </div>
          <button 
            onClick={() => toast.success('All settings saved successfully')}
            className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-2xl font-display font-bold shadow-xl shadow-green-900/20 hover:bg-green-800 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

        <div className="space-y-8">
          {settingsGroups.map((group, i) => (
            <motion.div 
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-bold text-app-muted uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <group.icon size={14} />
                {group.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map(item => (
                  <div 
                    key={item.label} 
                    onClick={() => toast.info(`${item.label} configuration module coming soon`)} 
                    className="bg-white p-6 rounded-[28px] border border-app-border shadow-sm hover:shadow-xl hover:border-green-700/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-app-bg text-app-muted group-hover:bg-green-50 group-hover:text-green-700 transition-colors flex items-center justify-center">
                        <item.icon size={22} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-app-bg flex items-center justify-center text-app-muted opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-display font-bold text-app-text">{item.label}</h4>
                      <p className="text-xs text-app-muted mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="pt-8 mt-8 border-t border-red-100">
          <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-display font-bold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700 mt-1">Maintenance mode and database reset</p>
            </div>
            <button className="px-8 py-3 bg-red-600 text-white rounded-2xl font-display font-bold shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all">
              Maintenance Mode
            </button>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
