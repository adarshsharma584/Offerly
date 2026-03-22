import { motion } from 'framer-motion';
import { MapPin, Phone, Star, CheckCircle2, Camera, Store, Globe } from 'lucide-react';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { useAuth } from '@/context/AuthContext';
import { usePlatformData } from '@/context/PlatformDataContext';
import { toast } from 'sonner';

export default function MerchantStore() {
  const { user } = useAuth();
  const { data } = usePlatformData();
  const merchant = data.merchants.find(m => m.id === user?.id) || data.merchants.find(m => m.name === user?.businessName);
  const merchantOffers = data.offers.filter(o => o.merchantId === merchant?.id);
  const merchantRedemptions = data.redemptions.filter(r => {
    const offer = data.offers.find(o => o.id === r.offerId);
    return offer?.merchantId === merchant?.id;
  });
  const revenue = merchantRedemptions.reduce((acc, r) => acc + r.billAmount, 0);

  if (!merchant) {
    return (
      <MerchantLayout>
        <div className="bg-white rounded-3xl border border-green-100 p-10 text-center">
          <Store size={28} className="mx-auto text-app-muted mb-3" />
          <p className="text-sm font-medium text-app-muted">Store profile not found.</p>
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-app-text">Store Profile</h1>
          <p className="text-app-muted text-sm mt-1">Manage your public business information</p>
        </div>

        <div className="bg-white rounded-3xl border border-green-100 overflow-hidden">
          <div className="relative h-52">
            <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div onClick={() => toast.info('Photo upload module coming soon')} className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/20">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h2 className="font-display font-bold text-2xl text-app-text">{merchant.name}</h2>
              {merchant.isVerified && <CheckCircle2 size={16} className="text-green-600" />}
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-green-50 text-green-700">verified</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-app-muted">
              <div className="flex items-center gap-2"><MapPin size={12} /> {merchant.address}</div>
              <div className="flex items-center gap-2"><Phone size={12} /> {merchant.phone}</div>
              <div className="flex items-center gap-2"><Star size={12} className="text-amber-500 fill-amber-500" /> {merchant.rating} rating</div>
              <div className="flex items-center gap-2"><Globe size={12} /> {merchant.city}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-green-100">
          <h3 className="font-display font-bold text-lg text-app-text mb-4">Subscription Plan</h3>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-700 text-white">
            <div>
              <p className="font-display font-bold text-xl capitalize">Pro Plan</p>
              <p className="text-white/70 text-xs">Billing cycle: Monthly · Next charge in 12 days</p>
            </div>
            <div onClick={() => toast.info('Upgrade module coming soon')} className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-xs font-display font-bold cursor-pointer border border-white/20">
              Manage
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-green-100">
          <h3 className="font-display font-bold text-lg text-app-text mb-4">Business Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Offers', value: merchantOffers.length },
              { label: 'Active', value: merchantOffers.filter(o => o.status === 'active').length },
              { label: 'Redemptions', value: merchantRedemptions.length },
              { label: 'Revenue', value: `₹${revenue.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className="bg-green-50/60 rounded-2xl p-4 text-center border border-green-100">
                <p className="font-display font-bold text-2xl text-green-800">{s.value}</p>
                <p className="text-app-muted text-[10px] uppercase tracking-widest font-bold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </MerchantLayout>
  );
}
