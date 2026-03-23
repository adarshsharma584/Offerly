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
  const [status, setStatus] = useState<'waiting' | 'approved' | 'expired'>('waiting');

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
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check for redemption status in localStorage (simulating real-time)
    const statusCheck = setInterval(() => {
      if (!qrPayload) return;
      const redemptions = JSON.parse(localStorage.getItem('offerly_redemptions') || '[]');
      const isRedeemed = redemptions.some((r: any) => r.token === qrPayload.token);
      if (isRedeemed) {
        setStatus('approved');
        clearInterval(statusCheck);
        clearInterval(timer);
        // After 2 seconds, navigate to success page
        setTimeout(() => {
          navigate(`/offers/${id}/approved`, { 
            state: { 
              billAmount: 0, // In real SaaS, merchant enters this
              savings: offer.value,
              offerId: offer.id 
            } 
          });
        }, 2000);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(statusCheck);
    };
  }, [qrPayload, offer, id, navigate]);

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
        
        <div className={`inline-flex items-center gap-1.5 ${status === 'approved' ? 'bg-green-100 text-green-700' : status === 'expired' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-xs font-display font-bold px-3 py-1 rounded-full mb-6`}>
          <span className={`w-2 h-2 ${status === 'approved' ? 'bg-green-700' : status === 'expired' ? 'bg-red-700' : 'bg-green-700'} rounded-full animate-pulse`} />
          {status === 'approved' ? 'OFFER REDEEMED!' : status === 'expired' ? 'QR EXPIRED' : 'WAITING FOR SCAN'}
        </div>

        {/* QR Section */}
        <div className="bg-white p-8 rounded-[40px] border-2 border-green-50 shadow-2xl relative overflow-hidden text-center">
          {status === 'approved' ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="font-display font-bold text-2xl text-app-text">Successfully Redeemed!</h3>
              <p className="text-app-muted mt-2">Redirecting to your savings summary...</p>
            </motion.div>
          ) : status === 'expired' ? (
            <div className="py-10">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={48} className="text-red-600" />
              </div>
              <h3 className="font-display font-bold text-2xl text-app-text">QR Code Expired</h3>
              <button onClick={regenerateQR} className="mt-6 px-6 py-3 bg-green-700 text-white rounded-full font-display font-bold">
                Regenerate QR
              </button>
            </div>
          ) : (
            <>
              <div className="bg-green-50 p-6 rounded-[32px] mb-8 inline-block">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  {qrPayload && <QRCodeSVG value={JSON.stringify(qrPayload)} size={220} level="H" includeMargin={true} />}
                </div>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center justify-center gap-2 font-display font-bold text-lg ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-700'}`}>
                  <Clock size={20} />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
                <p className="text-app-muted text-sm max-w-[240px] mx-auto">
                  Show this QR code to the store merchant to redeem your offer.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-10 space-y-6">
          <h4 className="font-display font-bold text-app-text text-lg">Next Steps</h4>
          <div className="space-y-4">
            {[
              { icon: '🛍️', text: 'Visit the store mentioned above' },
              { icon: '📱', text: 'Show this QR code to the merchant' },
              { icon: '✨', text: 'Merchant will scan and apply your discount' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl">{step.icon}</span>
                <p className="text-app-mid font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
