import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '₹0',
    duration: '1 Month',
    desc: 'Perfect for new local shops to test the platform.',
    features: ['5 Active Offers', 'Basic Analytics', 'Standard Support', 'Public Store Profile'],
    icon: Zap,
    color: 'bg-slate-100 text-slate-600',
    btnClass: 'bg-slate-800 text-white hover:bg-slate-900'
  },
  {
    id: 'monthly',
    name: 'Growth',
    price: '₹999',
    duration: '/ month',
    desc: 'Best for growing businesses wanting more reach.',
    features: ['Unlimited Offers', 'Advanced Analytics', 'Priority Support', 'Featured Listing', 'Customer Insights'],
    icon: Rocket,
    color: 'bg-green-100 text-green-700',
    btnClass: 'bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-900/20',
    popular: true
  },
  {
    id: 'yearly',
    name: 'Enterprise',
    price: '₹8,999',
    duration: '/ year',
    desc: 'Maximum visibility and lowest per-month cost.',
    features: ['Everything in Growth', 'Dedicated Account Manager', 'Advertisement Credits', 'Custom Branding', 'API Access'],
    icon: Crown,
    color: 'bg-amber-100 text-amber-700',
    btnClass: 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-900/20'
  }
];

export default function MerchantPricingPage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    setLoading(planId);
    // Simulate payment gateway
    setTimeout(() => {
      updateUser({ subscriptionPlan: planId as any });
      toast.success(`Plan ${planId} activated successfully!`);
      navigate('/merchant');
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            Subscription Plans
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Choose Your Growth Path</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Select a plan that fits your business needs. You can upgrade or cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-[32px] p-8 border-2 transition-all relative ${
                  plan.popular ? 'border-green-500 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl ${plan.color} flex items-center justify-center mb-6`}>
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-display font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.duration}</span>
                </div>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">{plan.desc}</p>

                <div className="space-y-4 mb-10">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <span className="text-slate-600 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={!!loading}
                  className={`w-full py-4 rounded-2xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.btnClass} ${loading === plan.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-xs mt-12">
          Secure payment processing. All prices are in INR. Needs help? <span className="text-green-600 font-bold cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </div>
  );
}
