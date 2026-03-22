import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OFFERS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const confettiColors = ['#2D6A4F', '#40916C', '#B7E4C7', '#FEF3C7', '#B45309', '#FFFFFF'];

export default function ApprovedPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const offer = OFFERS.find(o => o.id === id);

  const billAmount = state?.billAmount || 0;
  const savings = state?.savings || 0;
  const finalBill = Math.max(0, billAmount - savings);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center relative overflow-hidden"
    >
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-2 h-2 rounded-full"
          style={{
            left: `${5 + Math.random() * 90}%`,
            backgroundColor: confettiColors[i % confettiColors.length],
            animation: `confetti-drop ${1.5 + Math.random() * 1.5}s ease-out forwards`,
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}

      {/* Checkmark */}
      <div className="mb-8 relative">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle className="animate-check-circle" cx="50" cy="50" r="45" fill="none" stroke="#2D6A4F" strokeWidth="5" />
          <path className="animate-check-mark" d="M30 50 L45 65 L70 35" fill="none" stroke="#2D6A4F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="font-display font-bold text-2xl text-app-text mb-2">Offer Approved</h1>
      <p className="text-app-muted text-sm mb-1">Discount Successfully Applied</p>
      <p className="text-app-muted text-xs mb-8">{user?.name}</p>

      {/* Summary Card */}
      <div className="w-full bg-green-50 rounded-3xl p-6 mb-10">
        {offer && (
          <p className="font-display font-bold text-sm text-app-text mb-4">{offer.title}</p>
        )}
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-app-muted">Savings Recorded</span>
          <span className="text-green-700 font-display font-bold">₹{savings}</span>
        </div>
        {billAmount > 0 && (
          <>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-app-muted">Bill Amount</span>
              <span className="text-app-text">₹{billAmount}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-app-muted">Discount</span>
              <span className="text-green-700">-₹{savings}</span>
            </div>
            <div className="border-t border-green-200 pt-3 flex justify-between items-end">
              <span className="text-app-text font-display font-bold">You Pay</span>
              <span className="text-3xl font-display font-bold text-app-text">₹{finalBill}</span>
            </div>
          </>
        )}
      </div>

      <motion.div
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/')}
        className="w-full bg-green-700 text-white py-4 rounded-full font-display font-bold cursor-pointer hover:bg-green-600 transition-colors text-base"
      >
        Done
      </motion.div>
    </motion.div>
  );
}
