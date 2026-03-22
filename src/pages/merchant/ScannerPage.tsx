import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, ArrowLeft, CheckCircle2, AlertCircle, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MerchantLayout from '@/components/layout/MerchantLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { useAuth } from '@/context/AuthContext';

export default function ScannerPage() {
  const navigate = useNavigate();
  const { data, addRedemption } = usePlatformData();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [manualCode, setManualCode] = useState('');

  const handleManualRedeem = () => {
    const merchant = data.merchants.find(m => m.id === user?.id) || data.merchants.find(m => m.name === user?.businessName);
    const merchantOffers = data.offers.filter(o => o.merchantId === merchant?.id && o.status === 'active');
    const offer = merchantOffers[0];
    if (!offer) {
      setResult({ success: false });
      setScanning(false);
      return;
    }
    const newRedemption = {
      offerId: offer.id,
      customerName: 'Demo Customer',
      billAmount: 500,
      discount: 100,
      savings: 100,
      redeemedAt: new Date().toISOString(),
    };
    
    addRedemption(newRedemption);
    setResult({ success: true, customer: 'Demo Customer', offer: offer.title });
    setScanning(false);
  };

  return (
    <MerchantLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-2xl">Redeem Offer</h1>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-app-border shadow-2xl relative overflow-hidden text-center">
          {scanning ? (
            <div className="space-y-8">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 border-2 border-green-500 rounded-3xl animate-pulse" />
                <div className="absolute inset-4 border-2 border-green-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-2xl" />
                
                <motion.div 
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-4 right-4 h-0.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10" 
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine size={64} className="text-green-500/20" />
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-app-text">Scanning for QR...</h3>
                <p className="text-app-muted text-sm mt-2">Position the customer's QR code within the frame</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-app-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-app-muted">OR ENTER CODE</span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full bg-app-bg border border-app-border rounded-2xl py-4 pl-12 pr-4 font-display font-bold text-app-text focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <button 
                  onClick={handleManualRedeem}
                  disabled={manualCode.length < 6}
                  className="px-6 bg-green-700 text-white rounded-2xl font-display font-bold disabled:opacity-50 transition-all"
                >
                  Verify
                </button>
              </div>
            </div>
          ) : result?.success ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-8 space-y-6">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-app-text">Offer Redeemed!</h3>
                <p className="text-app-muted font-medium mt-2">Successfully processed for {result.customer}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-left">
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2">Offer Details</p>
                <p className="font-display font-bold text-app-text">{result.offer}</p>
                <div className="flex justify-between mt-4 pt-4 border-t border-green-200/50">
                  <span className="text-xs font-bold text-app-muted">TIME</span>
                  <span className="text-xs font-bold text-app-text">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <button 
                onClick={() => { setScanning(true); setResult(null); setManualCode(''); }}
                className="w-full py-4 bg-[#0B2519] text-white rounded-2xl font-display font-bold shadow-xl transition-all"
              >
                Scan Another
              </button>
            </motion.div>
          ) : (
            <div className="py-8 space-y-6">
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={48} />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-app-text">Invalid Code</h3>
                <p className="text-app-muted font-medium mt-2">The code you entered is incorrect or expired.</p>
              </div>
              <button 
                onClick={() => setScanning(true)}
                className="w-full py-4 bg-[#0B2519] text-white rounded-2xl font-display font-bold shadow-xl transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </MerchantLayout>
  );
}
