import { motion } from 'framer-motion';
import { Settings, Clock, Bell, CreditCard, Users, HelpCircle, ArrowRight, Save, User, ShieldCheck } from 'lucide-react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { toast } from 'sonner';

export default function MerchantSettings() {
  const settingsGroups = [
    {
      title: 'Store Configuration',
      icon: Clock,
      items: [
        { label: 'Business Hours', desc: 'Set your opening and closing times', icon: Clock },
        { label: 'Staff Management', desc: 'Add or remove store managers', icon: Users },
      ]
    },
    {
      title: 'Preferences',
      icon: Bell,
      items: [
        { label: 'Notifications', desc: 'Manage redemption and low-use alerts', icon: Bell },
        { label: 'Profile Privacy', desc: 'Control who sees your store metrics', icon: ShieldCheck },
      ]
    },
    {
      title: 'Payments & Billing',
      icon: CreditCard,
      items: [
        { label: 'Payout Settings', desc: 'Configure bank account & UPI', icon: CreditCard },
        { label: 'Subscription Plan', desc: 'Manage your current Offerly plan', icon: Save },
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Help Center', desc: 'FAQs and merchant guides', icon: HelpCircle },
      ]
    }
  ];

  return (
    <MerchantLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl text-app-text">Portal Settings</h1>
            <p className="text-app-muted text-sm mt-1">Manage your business account and store preferences</p>
          </div>
          <button 
            onClick={() => toast.success('Settings updated successfully')}
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
                    onClick={() => toast.info(`${item.label} module coming soon`)} 
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

        {/* Account Status Card */}
        <div className="bg-[#0B2519] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden mt-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck size={32} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold">Verification Status</h3>
                <p className="text-green-50/60 text-sm mt-1">Your business is fully verified and active.</p>
              </div>
            </div>
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-display font-bold text-sm transition-all border border-white/10">
              View Certificate
            </button>
          </div>
        </div>
      </motion.div>
    </MerchantLayout>
  );
}
