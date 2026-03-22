import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Sparkles, User, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'merchant' | 'admin'>('user');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleContinue = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setError('');
    login(`+91 ${phone}`, role);
    
    if (role === 'admin') navigate('/admin');
    else if (role === 'merchant') navigate('/merchant');
    else navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row"
    >
      {/* Hero — left/top */}
      <div
        className="flex-[0_0_45%] md:flex-[0_0_50%] md:min-h-screen flex flex-col items-center justify-center relative overflow-hidden gradient-hero"
      >
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(82,183,136,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(64,145,108,0.3) 0%, transparent 50%)'
        }} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mb-4 border border-white/20">
            <Gift size={40} className="text-white md:w-12 md:h-12" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">OFFERLY</h1>
          <p className="text-white/70 text-sm md:text-base mt-2">Discover deals near you</p>

          {/* Floating stats — desktop only */}
          <div className="hidden md:flex gap-6 mt-10">
            {[
              { value: '10K+', label: 'Users' },
              { value: '500+', label: 'Merchants' },
              { value: '₹2L+', label: 'Saved' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/10 text-center">
                <p className="text-white font-display font-bold text-xl">{s.value}</p>
                <p className="text-white/60 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating decorations */}
        <div className="float-anim absolute bottom-8 right-12">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-display font-bold text-lg border border-white/10">
            %
          </div>
        </div>
        <div className="float-anim absolute top-16 left-10" style={{ animationDelay: '1.5s' }}>
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-display text-sm font-bold border border-white/10">
            ₹
          </div>
        </div>
        <div className="float-anim absolute bottom-20 left-16" style={{ animationDelay: '2s' }}>
          <Sparkles size={20} className="text-green-200/40" />
        </div>
      </div>

      {/* Form — right/bottom */}
      <div className="flex-1 bg-white rounded-t-[28px] md:rounded-none -mt-6 md:mt-0 relative z-10 flex items-start md:items-center justify-center shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-none">
        <div className="w-full max-w-[420px] px-6 md:px-10 pt-8 md:pt-0 pb-10">
          {/* Mobile drag handle */}
          <div className="w-10 h-1 bg-app-border rounded-full mx-auto mb-6 md:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Desktop logo */}
            <div className="hidden md:flex items-center gap-2 mb-8">
              <Gift size={24} className="text-green-700" />
              <span className="font-display font-bold text-xl text-green-700">OFFERLY</span>
            </div>

            <h2 className="font-display font-bold text-[22px] md:text-[28px] text-app-text mb-1">Log in or sign up</h2>
            <p className="text-app-muted text-sm mb-6">Discover local deals near you</p>

            <div className="flex gap-2 mb-6">
              {[
                { id: 'user', label: 'User', icon: User },
                { id: 'merchant', label: 'Merchant', icon: Store },
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-display font-bold text-xs ${
                    role === r.id 
                      ? 'bg-green-700 border-green-700 text-white shadow-glow' 
                      : 'border-app-border text-app-muted hover:border-green-100 hover:bg-green-50'
                  }`}
                >
                  <r.icon size={14} />
                  {r.label}
                </button>
              ))}
            </div>

            <div className="bg-green-50/50 px-4 py-3.5 flex items-center mb-2 !rounded-xl focus-within:ring-2 focus-within:ring-green-700/20 transition-all">
              <span className="text-sm mr-2">🇮🇳</span>
              <span className="text-app-muted text-sm mr-2 font-display">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(''); }}
                placeholder="Enter mobile number"
                maxLength={10}
                className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
              />
            </div>
            {error && <p className="text-red-600 text-xs mb-3 mt-1">{error}</p>}

            <label className="flex items-center gap-2 mt-3 mb-5 cursor-pointer">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  remember ? 'bg-green-700 border-green-700 shadow-glow' : 'border-app-border'
                }`}
              >
                {remember && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className="text-app-muted text-xs">Remember me for faster sign-in</span>
            </label>

            <motion.div
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleContinue}
              className="w-full gradient-accent text-white font-display font-bold text-center py-3.5 rounded-full cursor-pointer transition-all shadow-glow hover:shadow-glow-lg"
            >
              Continue
            </motion.div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-app-border" />
              <span className="text-app-muted text-xs">OR</span>
              <div className="flex-1 h-px bg-app-border" />
            </div>

            <div className="flex gap-3">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex-1 glass-card flex items-center justify-center gap-2 py-3 cursor-pointer hover:shadow-glass transition-all !rounded-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-sm font-display font-semibold text-app-text">Google</span>
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex-1 glass-card flex items-center justify-center gap-2 py-3 cursor-pointer hover:shadow-glass transition-all !rounded-full"
              >
                <span className="text-lg">✉️</span>
                <span className="text-sm font-display font-semibold text-app-text">Email</span>
              </motion.div>
            </div>

            <p className="text-center text-app-muted text-[11px] mt-8">
              Terms of Service · Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
