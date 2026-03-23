import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth, SubAdminCategory } from '@/context/AuthContext';

const SUB_ADMIN_CATEGORIES: { id: SubAdminCategory; label: string }[] = [
  { id: 'support', label: 'Customer Support' },
  { id: 'merchant_mgmt', label: 'Merchant Management' },
  { id: 'offer_mgmt', label: 'Offer Management' },
  { id: 'feedback', label: 'Feedback & Reviews' },
];

export default function SubAdminLoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState<SubAdminCategory>(null);
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!loginEmail.includes('@')) { setError('Enter a valid email address'); return; }
    if (!loginPass) { setError('Enter your password'); return; }
    setError('');
    localStorage.setItem('offerly_phone', loginEmail);
    localStorage.setItem('offerly_login_role', 'sub_admin');
    navigate('/otp');
  };

  const handleRegister = () => {
    if (!fullName.trim()) { setError('Enter your full name'); return; }
    if (!category) { setError('Select an administrative category'); return; }
    if (!regEmail.includes('@')) { setError('Enter a valid email address'); return; }
    if (regPass.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (regPass !== regConfirm) { setError('Passwords do not match'); return; }
    setError('');
    localStorage.setItem('offerly_phone', regEmail);
    localStorage.setItem('offerly_login_role', 'sub_admin');
    // Store category temporarily for the mock login
    localStorage.setItem('offerly_sub_cat', category);
    navigate('/otp');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* ── Green Hero ── */}
      <div className="flex-[0_0_45%] md:flex-[0_0_48%] md:min-h-screen flex flex-col items-center justify-center relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(82,183,136,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(64,145,108,0.3) 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/20">
            <LayoutDashboard size={40} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">OFFERLY</h1>
          <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 mt-3 mb-6">
            <p className="text-white text-[10px] font-display font-bold uppercase tracking-widest">Sub-Admin Portal</p>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight max-w-[300px]">Specific Control Center</h2>
          <p className="text-white/70 text-sm mt-3 max-w-[280px]">Manage your assigned category with dedicated dashboards and real-time data.</p>
        </div>
      </div>

      {/* ── Form Side ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>Login</button>
            <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === 'register' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>Register</button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your administrative panel.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="name@offerly.in" />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input type={showLoginPass ? 'text' : 'password'} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="••••••••" />
                    <button onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-5 bottom-4 text-gray-400 hover:text-gray-600 transition-colors">{showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}
                  <button onClick={handleLogin} className="w-full bg-green-700 hover:bg-green-800 text-white font-display font-bold py-4 rounded-2xl shadow-xl shadow-green-700/20 transition-all mt-4">Sign In</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Request Access</h2>
                <p className="text-gray-500 text-sm mb-8">Join the administrative team to help manage Offerly's growth.</p>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Assigned Category</label>
                    <div className="relative">
                      <select value={category || ''} onChange={(e) => setCategory(e.target.value as SubAdminCategory)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                        <option value="" disabled>Select Category</option>
                        {SUB_ADMIN_CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="name@offerly.in" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                      <input type={showRegPass ? 'text' : 'password'} value={regPass} onChange={(e) => setRegPass(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="••••••" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
                      <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" placeholder="••••••" />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}
                  <button onClick={handleRegister} className="w-full bg-green-700 hover:bg-green-800 text-white font-display font-bold py-4 rounded-2xl shadow-xl shadow-green-700/20 transition-all mt-4">Create Account</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
