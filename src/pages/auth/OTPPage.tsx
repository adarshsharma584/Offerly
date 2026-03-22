import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const phone = localStorage.getItem('offerly_phone') || '+91 98767 54321';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6) verify(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verify = (code?: string) => {
    const finalCode = code || otp.join('');
    if (finalCode.length !== 6) { setError('Enter all 6 digits'); return; }
    setLoading(true);
    setTimeout(() => { login(phone); navigate('/'); }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white flex flex-col md:flex-row"
    >
      {/* Desktop left panel */}
      <div className="hidden md:flex md:flex-[0_0_45%] gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(82,183,136,0.5) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-white font-display font-bold text-3xl mb-2">Secure Verification</h2>
          <p className="text-white/60 text-sm max-w-[280px] mx-auto">We sent a 6-digit OTP to your phone for verification</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pt-6 md:pt-0">
        <div className="w-full max-w-[420px]">
          <div className="w-full flex items-center justify-between mb-10">
            <div onClick={() => navigate('/login')} className="p-2 -ml-2 cursor-pointer hover:bg-green-50 rounded-xl transition-colors">
              <ArrowLeft size={24} className="text-green-700" />
            </div>
            <div className="flex items-center gap-1.5 md:hidden">
              <Gift size={20} className="text-green-700" />
              <span className="font-display font-bold text-green-700">OFFERLY</span>
            </div>
            <div className="w-10" />
          </div>

          <h1 className="font-display font-bold text-2xl md:text-3xl text-app-text mb-2">Enter OTP</h1>
          <p className="text-app-muted text-sm mb-1">We sent a 6-digit code to</p>
          <p className="font-display font-bold text-sm text-green-700 mb-8">{phone}</p>

          <div className="flex gap-3 mb-3 justify-center md:justify-start">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`w-12 h-14 md:w-14 md:h-16 text-center font-display font-bold text-xl rounded-2xl border-2 transition-all outline-none ${
                  digit ? 'bg-green-50 border-green-700 shadow-glow' : 'bg-app-bg border-app-border'
                }`}
              />
            ))}
          </div>
          {error && <p className="text-red-600 text-xs mb-4">{error}</p>}

          <div className="mb-8 mt-4 text-center md:text-left">
            {resendTimer > 0 ? (
              <span className="text-app-muted text-sm">Resend in <span className="font-display font-bold text-app-text">0:{resendTimer.toString().padStart(2, '0')}</span></span>
            ) : (
              <span onClick={() => setResendTimer(30)} className="text-green-700 font-display font-bold text-sm cursor-pointer hover:underline">
                Resend OTP
              </span>
            )}
          </div>

          <motion.div
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => !loading && verify()}
            className="w-full gradient-accent text-white font-display font-bold text-center py-3.5 rounded-full cursor-pointer transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
