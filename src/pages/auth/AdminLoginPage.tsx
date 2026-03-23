import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const NAVY_BUTTON = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email.includes('@')) {
      setError('Enter a valid admin email');
      return;
    }
    if (!password) {
      setError('Enter your password');
      return;
    }
    setError('');
    localStorage.setItem('offerly_phone', email);
    localStorage.setItem('offerly_login_role', 'admin');
    navigate('/otp');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row"
    >
      {/* Hero */}
      <div className="flex-[0_0_45%] md:flex-[0_0_48%] md:min-h-screen flex flex-col items-center justify-center relative overflow-hidden gradient-hero">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(82,183,136,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(64,145,108,0.3) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20">
            <ShieldCheck size={40} className="text-white" />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
            OFFERLY
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 mt-3 mb-6">
            <p className="text-white text-[10px] font-display font-bold uppercase tracking-widest">
              Admin Console
            </p>
          </div>

          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight max-w-[280px]">
            Central Control Center
          </h2>
          <p className="text-white/70 text-sm mt-3 max-w-[260px]">
            Manage users, merchants, and offers with secure admin access
          </p>

          <div className="hidden md:flex items-center gap-3 mt-10 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10">
            <Lock size={16} className="text-white/80" />
            <p className="text-white/80 text-xs font-display tracking-wide">
              Secure session · Role-based access
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded-t-[28px] md:rounded-none -mt-6 md:mt-0 relative z-10 flex items-start md:items-center justify-center shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-none">
        <div className="w-full max-w-[430px] px-6 md:px-10 pt-8 md:pt-0 pb-10">
          <div className="w-10 h-1 bg-app-border rounded-full mx-auto mb-6 md:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Desktop logo */}
            <div className="hidden md:flex items-center gap-2 mb-8">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-700"
              >
                <ShieldCheck size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900">OFFERLY</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1 bg-green-100 text-green-700">
                Admin
              </span>
            </div>

            <h2 className="font-display font-bold text-[24px] md:text-[28px] text-app-text mb-1">
              Admin sign in
            </h2>
            <p className="text-app-muted text-sm mb-6">Authorized personnel only</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2 mb-5">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                This console provides access to critical platform operations. Unauthorized
                access is prohibited.
              </p>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="admin-input px-4 py-3.5 flex items-center rounded-xl border-2 border-app-border transition-all bg-slate-50/70">
                <Mail size={16} className="text-app-muted mr-3 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Admin email"
                  className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                  style={{ boxShadow: 'none' }}
                />
              </div>

              {/* Password */}
              <div className="admin-input px-4 py-3.5 flex items-center rounded-xl border-2 border-app-border transition-all bg-slate-50/70">
                <Lock size={16} className="text-app-muted mr-3 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                  style={{ boxShadow: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-app-muted ml-2 hover:text-app-text transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleLogin}
              className="w-full text-white font-display font-bold text-center py-3.5 rounded-full cursor-pointer transition-all mt-6"
              style={{
                background: NAVY_BUTTON,
                boxShadow: '0 4px 22px rgba(49,46,129,0.32)',
              }}
            >
              Sign In to Admin Console
            </motion.button>

            <div className="mt-7 pt-5 border-t border-app-border space-y-2">
              <p className="text-center text-app-muted text-xs">
                <Link to="/login" className="text-indigo-700 font-bold hover:underline">
                  ← User App
                </Link>
                {' · '}
                <Link
                  to="/merchant/login"
                  className="text-indigo-700 font-bold hover:underline"
                >
                  Merchant Portal
                </Link>
              </p>
            </div>

            <p className="text-center text-app-muted text-[11px] mt-4">
              Security Policy · Access Logs
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
