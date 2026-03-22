import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Gift } from 'lucide-react';
import { OFFERS, MERCHANTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { generateQRData, getQRPayload, getRemainingSeconds } from '@/utils/qrHelper';
import { formatTimer } from '@/utils/formatters';

export default function QRRedeemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const offer = OFFERS.find(o => o.id === id);
  const merchant = offer ? MERCHANTS.find(m => m.id === offer.merchantId) : null;

  const [qrPayload, setQrPayload] = useState<ReturnType<typeof generateQRData> | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [billAmount, setBillAmount] = useState('');

  useEffect(() => {
    if (!offer || !user) return;
    let payload = getQRPayload(offer.id);
    if (!payload || getRemainingSeconds(payload) <= 0) {
      payload = generateQRData(offer.id, user.id);
    }
    setQrPayload(payload);
    setTimeLeft(getRemainingSeconds(payload));
  }, [offer, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const regenerateQR = () => {
    if (!offer || !user) return;
    const payload = generateQRData(offer.id, user.id);
    setQrPayload(payload);
    setTimeLeft(600);
  };

  const isExpired = timeLeft === 0;
  const isCritical = timeLeft < 30;
  const isWarning = timeLeft < 60;

  const handleApprove = () => {
    if (!offer || !user) return;
    const bill = Number(billAmount) || 0;
    const savings = offer.type === 'percent' ? Math.round(bill * offer.value / 100) : offer.value;

    // Store redemption
    const redemptions = JSON.parse(localStorage.getItem('offerly_redemptions') || '[]');
    redemptions.push({
      offerId: offer.id,
      merchantId: offer.merchantId,
      redeemedAt: new Date().toISOString(),
      billAmount: bill,
      discountAmount: savings,
      savings,
    });
    localStorage.setItem('offerly_redemptions', JSON.stringify(redemptions));

    // Update user stats
    const userData = JSON.parse(localStorage.getItem('offerly_user') || '{}');
    userData.offersUsed = (userData.offersUsed || 0) + 1;
    userData.totalSavings = (userData.totalSavings || 0) + savings;
    localStorage.setItem('offerly_user', JSON.stringify(userData));

    navigate(`/offers/${id}/approved`, { state: { billAmount: bill, savings, offerId: offer.id } });
  };

  if (!offer || !merchant) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div onClick={() => navigate(-1)} className="p-2 -ml-2 cursor-pointer">
          <ArrowLeft size={24} className="text-app-text" />
        </div>
        <div className="flex items-center gap-1.5">
          <Gift size={18} className="text-green-700" />
          <span className="font-display font-bold text-green-700 tracking-tight">OFFERLY</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="px-5 pt-2 pb-10">
        {/* Merchant + offer info */}
        <h2 className="font-display font-bold text-xl text-app-text mb-1">{merchant.name}</h2>
        <p className="text-app-muted text-sm mb-2">{offer.title}</p>
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-display font-bold px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-700 rounded-full" />
          Offer Active
        </div>
        <p className="text-app-muted text-xs mb-6">Valid for this visit</p>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <div className="relative p-6 bg-white rounded-[32px] shadow-qr-glow">
            <div className={`transition-all ${isExpired ? 'blur-md' : ''}`}>
              {qrPayload && (
                <QRCodeSVG
                  value={JSON.stringify(qrPayload)}
                  size={200}
                  fgColor="#1B4332"
                  level="M"
                />
              )}
            </div>
            {isExpired && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 rounded-[32px]">
                <p className="text-red-600 font-display font-bold mb-2">QR Expired</p>
                <div
                  onClick={regenerateQR}
                  className="bg-green-700 text-white font-display font-bold px-4 py-2 rounded-full text-sm cursor-pointer"
                >
                  Generate New QR
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-app-muted text-sm mb-6">Show this QR code to the merchant before payment</p>

        {/* Timer */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center gap-2 text-app-muted text-sm">
            <Clock size={16} />
            <span>QR expires in:</span>
          </div>
          <motion.span
            animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
            transition={isCritical ? { repeat: Infinity, duration: 0.8 } : {}}
            className={`text-4xl font-display font-bold ${
              isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-700'
            } ${isCritical ? 'animate-pulse-scale' : ''}`}
          >
            {formatTimer(timeLeft)}
          </motion.span>
        </div>

        {/* Bill Amount */}
        <div className="bg-app-bg rounded-2xl p-5 mb-4">
          <label className="block text-xs font-display font-bold text-app-muted mb-2 uppercase tracking-wider">
            Enter Bill Amount (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-display font-bold text-app-text">₹</span>
            <input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-app-border rounded-xl py-3 pl-10 pr-4 font-display text-lg text-app-text outline-none"
            />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-3 mb-8 text-center">
          <p className="text-app-muted text-xs">Discount will be applied by the merchant</p>
          <p className="text-app-muted text-xs">Offerly does not handle payments</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 py-4 rounded-full border border-red-100 text-red-600 font-display font-bold cursor-pointer hover:bg-red-50 transition-colors"
          >
            <XCircle size={20} /> Cancel
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={handleApprove}
            className="flex items-center justify-center gap-2 py-4 rounded-full bg-green-700 text-white font-display font-bold cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
          >
            <CheckCircle2 size={20} /> Approve
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
