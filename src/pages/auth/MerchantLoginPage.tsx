import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, TrendingUp, Users, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  'Food & Beverage',
  'Retail & Shopping',
  'Salon & Beauty',
  'Healthcare',
  'Electronics',
  'Entertainment',
  'Fitness & Wellness',
  'Education',
  'Home & Lifestyle',
  'Automotive',
];

const AMBER_GRADIENT = 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)';
const AMBER_HERO = 'linear-gradient(160deg, #451a03 0%, #92400e 35%, #b45309 65%, #d97706 100%)';

export default function MerchantLoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const switchTab = (t: 'login' | 'register') => {
    setTab(t);
    setError('');
  };

  const handleLogin = () => {
    if (!loginEmail.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    if (!loginPass) {
      setError('Enter your password');
      return;
    }
    setError('');
    login(loginEmail, 'merchant');
    navigate('/merchant');
  };

  const handleRegister = () => {
    if (!bizName.trim()) { setError('Enter your business name'); return; }
    if (!category) { setError('Select a business category'); return; }
    if (!ownerName.trim()) { setError('Enter owner / manager name'); return; }
    if (!regEmail.includes('@')) { setError('Enter a valid email address'); return; }
    if (regPhone.replace(/\D/g, '').length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    if (regPass.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (regPass !== regConfirm) { setError('Passwords do not match'); return; }
    setError('');
    login(regEmail, 'merchant');
    navigate('/merchant');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col md:flex-row"
    >
      {/* ── Amber Hero ── */}
      <div
        className="flex-[0_0_45%] md:flex-[0_0_48%] md:min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: AMBER_HERO }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(251,191,36,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(180,83,9,0.3) 0%, transparent 50%)',
          }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mb-5 border border-white/20">
            <Store size={40} className="text-white" />
          </div>

          {/* Brand */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
              OFFERLY
            </span>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 mb-4">
            <p className="text-amber-100 text-[10px] font-display font-bold uppercase tracking-widest">
              Merchant Portal
            </p>
          </div>

          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight max-w-[260px]">
            Your Business, Amplified
          </h2>
          <p className="text-white/65 text-sm mt-3 max-w-[220px]">
            Join hundreds of merchants growing with Offerly
          </p>

          {/* Stats — desktop only */}
          <div className="hidden md:flex gap-5 mt-10">
            {[
              { value: '500+', label: 'Merchants', Icon: Store },
              { value: '₹50L+', label: 'Revenue', Icon: TrendingUp },
              { value: '10K+', label: 'Customers', Icon: Users },
            ].map(({ value, label, Icon }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10 text-center"
              >
                <Icon size={14} className="text-amber-200/70 mx-auto mb-1" />
                <p className="text-white font-display font-bold text-lg">{value}</p>
                <p className="text-white/55 text-[11px]">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating decorations */}
        <div className="float-anim absolute bottom-8 right-12">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
            <TrendingUp size={22} className="text-amber-200" />
          </div>
        </div>
        <div className="float-anim absolute top-16 left-10" style={{ animationDelay: '1.5s' }}>
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-200 font-display text-base font-bold border border-white/15">
            %
          </div>
        </div>
        <div className="float-anim absolute bottom-24 left-14" style={{ animationDelay: '2.5s' }}>
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Store size={14} className="text-amber-200/60" />
          </div>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="flex-1 bg-white rounded-t-[28px] md:rounded-none -mt-6 md:mt-0 relative z-10 flex items-start md:items-center justify-center shadow-[0_-8px_40px_rgba(0,0,0,0.12)] md:shadow-none overflow-y-auto">
        <div className="w-full max-w-[440px] px-6 md:px-10 pt-8 md:pt-6 pb-10">
          {/* Mobile handle */}
          <div className="w-10 h-1 bg-app-border rounded-full mx-auto mb-6 md:hidden" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Desktop logo */}
            <div className="hidden md:flex items-center gap-2 mb-7">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: AMBER_GRADIENT }}
              >
                <Store size={16} className="text-white" />
              </div>
              <span
                className="font-display font-bold text-lg"
                style={{ color: '#92400e' }}
              >
                OFFERLY
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                style={{ background: '#FEF3C7', color: '#92400e' }}
              >
                Merchant
              </span>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-amber-50 rounded-2xl p-1 mb-7">
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm transition-all ${
                    tab === t
                      ? 'bg-white shadow-sm text-amber-900'
                      : 'text-amber-600 hover:text-amber-900'
                  }`}
                >
                  {t === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            {/* ── Login Tab ── */}
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className="font-display font-bold text-[22px] text-app-text mb-1">
                    Welcome back
                  </h2>
                  <p className="text-app-muted text-sm mb-6">
                    Sign in to your merchant dashboard
                  </p>

                  <div className="space-y-3">
                    {/* Email */}
                    <div className="merchant-input px-4 py-3.5 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-app-muted text-sm mr-3">✉️</span>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => { setLoginEmail(e.target.value); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Business email address"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>

                    {/* Password */}
                    <div className="merchant-input px-4 py-3.5 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-app-muted text-sm mr-3">🔒</span>
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        value={loginPass}
                        onChange={(e) => { setLoginPass(e.target.value); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Password"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="text-app-muted ml-2 hover:text-app-text transition-colors"
                      >
                        {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

                  <div className="flex justify-end mt-2 mb-5">
                    <span
                      className="text-xs font-display font-semibold cursor-pointer hover:underline"
                      style={{ color: '#b45309' }}
                    >
                      Forgot password?
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={handleLogin}
                    className="w-full text-white font-display font-bold text-center py-3.5 rounded-full cursor-pointer transition-all"
                    style={{
                      background: AMBER_GRADIENT,
                      boxShadow: '0 4px 20px rgba(180,83,9,0.30)',
                    }}
                  >
                    Sign In to Dashboard
                  </motion.button>

                  <p className="text-center text-app-muted text-xs mt-5">
                    New merchant?{' '}
                    <button
                      onClick={() => switchTab('register')}
                      className="font-bold hover:underline"
                      style={{ color: '#b45309' }}
                    >
                      Create an account →
                    </button>
                  </p>
                </motion.div>
              ) : (
                /* ── Register Tab ── */
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className="font-display font-bold text-[22px] text-app-text mb-1">
                    Create merchant account
                  </h2>
                  <p className="text-app-muted text-sm mb-5">
                    Start growing your business today
                  </p>

                  <div className="space-y-3">
                    {/* Business Name */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <Store size={15} className="text-app-muted mr-3 shrink-0" />
                      <input
                        type="text"
                        value={bizName}
                        onChange={(e) => { setBizName(e.target.value); setError(''); }}
                        placeholder="Business name"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>

                    {/* Category */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <ChevronDown size={15} className="text-app-muted mr-3 shrink-0" />
                      <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setError(''); }}
                        className="flex-1 bg-transparent outline-none text-sm font-body appearance-none"
                        style={{
                          boxShadow: 'none',
                          color: category ? '#111827' : '#9CA3AF',
                        }}
                      >
                        <option value="">Select business category</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Owner Name */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <Users size={15} className="text-app-muted mr-3 shrink-0" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => { setOwnerName(e.target.value); setError(''); }}
                        placeholder="Owner / manager name"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>

                    {/* Email */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-app-muted text-sm mr-3">✉️</span>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => { setRegEmail(e.target.value); setError(''); }}
                        placeholder="Business email"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>

                    {/* Phone */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-sm mr-2">🇮🇳</span>
                      <span className="text-app-muted text-sm mr-2 font-display">+91</span>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => { setRegPhone(e.target.value); setError(''); }}
                        placeholder="Mobile number"
                        maxLength={10}
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>

                    {/* Password */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-app-muted text-sm mr-3">🔒</span>
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        value={regPass}
                        onChange={(e) => { setRegPass(e.target.value); setError(''); }}
                        placeholder="Create password"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        className="text-app-muted ml-2 hover:text-app-text transition-colors"
                      >
                        {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="merchant-input px-4 py-3 flex items-center rounded-xl border-2 border-app-border transition-all bg-amber-50/40">
                      <span className="text-app-muted text-sm mr-3">🔑</span>
                      <input
                        type="password"
                        value={regConfirm}
                        onChange={(e) => { setRegConfirm(e.target.value); setError(''); }}
                        placeholder="Confirm password"
                        className="flex-1 bg-transparent outline-none text-sm text-app-text font-body"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={handleRegister}
                    className="w-full text-white font-display font-bold text-center py-3.5 rounded-full cursor-pointer transition-all mt-5"
                    style={{
                      background: AMBER_GRADIENT,
                      boxShadow: '0 4px 20px rgba(180,83,9,0.30)',
                    }}
                  >
                    Create Account
                  </motion.button>

                  <p className="text-center text-app-muted text-xs mt-4">
                    Already registered?{' '}
                    <button
                      onClick={() => switchTab('login')}
                      className="font-bold hover:underline"
                      style={{ color: '#b45309' }}
                    >
                      Sign in →
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer links */}
            <div className="mt-7 pt-5 border-t border-app-border space-y-2">
              <p className="text-center text-app-muted text-xs">
                <Link
                  to="/login"
                  className="font-bold hover:underline"
                  style={{ color: '#b45309' }}
                >
                  ← User App
                </Link>
                {' · '}
                <Link
                  to="/admin/login"
                  className="font-bold hover:underline"
                  style={{ color: '#b45309' }}
                >
                  Admin Console
                </Link>
              </p>
            </div>

            <p className="text-center text-app-muted text-[11px] mt-4">
              Terms of Service · Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
