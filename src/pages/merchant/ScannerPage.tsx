import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, ArrowLeft, CheckCircle2, AlertCircle, X, Search, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePlatformData } from '@/context/PlatformDataContext';
import { useAuth } from '@/context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'sonner';

export default function ScannerPage() {
  const navigate = useNavigate();
  const { data, addRedemption } = usePlatformData();
  const { user } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [manualCode, setManualCode] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanning && !result) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [scanning, result]);

  function onScanSuccess(decodedText: string) {
    try {
      const payload = JSON.parse(decodedText);
      if (payload.offerId && payload.token) {
        // Stop scanning
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        
        // Find the offer
        const offer = data.offers.find(o => o.id === payload.offerId);
        if (!offer) {
          toast.error("Invalid offer code");
          return;
        }

        setResult({ 
          success: true, 
          offer, 
          payload,
          customer: "Customer #" + payload.userId.slice(-4)
        });
        setScanning(false);
      }
    } catch (e) {
      console.error("Invalid QR code", e);
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const handleConfirmRedemption = () => {
    if (!result || !result.offer) return;
    
    const bill = Number(billAmount) || 0;
    const savings = result.offer.type === 'percent' 
      ? Math.round(bill * result.offer.value / 100) 
      : result.offer.value;

    const newRedemption = {
      offerId: result.offer.id,
      token: result.payload.token,
      customerName: result.customer,
      billAmount: bill,
      discount: savings,
      savings,
      redeemedAt: new Date().toISOString(),
    };
    
    // 1. Update Platform Data
    addRedemption(newRedemption);
    
    // 2. Update Global Redemptions (for user app to see)
    const redemptions = JSON.parse(localStorage.getItem('offerly_redemptions') || '[]');
    redemptions.push(newRedemption);
    localStorage.setItem('offerly_redemptions', JSON.stringify(redemptions));

    toast.success("Offer redeemed successfully!");
    setResult({ ...result, confirmed: true, savings });
  };

  const resetScanner = () => {
    setResult(null);
    setScanning(true);
    setManualCode('');
    setBillAmount('');
  };

  return (
    <DashboardLayout role="merchant">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display font-bold text-2xl">Redeem Offer</h1>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-[40px] border border-app-border shadow-2xl relative overflow-hidden">
          {scanning && !result ? (
            <div className="space-y-8">
              <div id="reader" className="overflow-hidden rounded-3xl border-2 border-green-100"></div>

              <div className="text-center">
                <h3 className="font-display font-bold text-xl text-app-text">Scanning for QR...</h3>
                <p className="text-app-muted text-sm mt-2">Position the customer's QR code within the frame</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-app-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
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
                  onClick={() => onScanSuccess(JSON.stringify({ offerId: 'o1', token: 'demo-token-' + manualCode, userId: 'u123' }))}
                  disabled={manualCode.length < 4}
                  className="px-6 bg-green-700 text-white rounded-2xl font-display font-bold disabled:opacity-50 transition-all"
                >
                  Verify
                </button>
              </div>
            </div>
          ) : result && !result.confirmed ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone size={32} className="text-green-600" />
                </div>
                <h3 className="font-display font-bold text-2xl text-app-text">Offer Found!</h3>
                <p className="text-app-muted mt-2">{result.offer.title}</p>
                <p className="text-green-700 font-bold text-sm bg-green-50 px-3 py-1 rounded-full inline-block mt-2">
                  {result.customer}
                </p>
              </div>

              <div className="bg-app-bg p-6 rounded-3xl space-y-4">
                <div>
                  <label className="block text-xs font-display font-bold text-app-muted mb-2 uppercase tracking-wider">
                    Total Bill Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-app-text">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      className="w-full bg-white border border-app-border rounded-2xl py-4 pl-10 pr-4 font-display font-bold text-xl text-app-text focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-app-border">
                  <span className="text-app-muted font-medium">Estimated Discount</span>
                  <span className="font-display font-bold text-green-700 text-lg">
                    - ₹{result.offer.type === 'percent' ? Math.round((Number(billAmount) || 0) * result.offer.value / 100) : result.offer.value}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={resetScanner}
                  className="flex-1 py-4 border border-app-border rounded-2xl font-display font-bold text-app-muted hover:bg-app-bg transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmRedemption}
                  className="flex-[2] py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-glow hover:bg-green-800 transition-all"
                >
                  Confirm Redemption
                </button>
              </div>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h3 className="font-display font-bold text-3xl text-app-text mb-2">Success!</h3>
              <p className="text-app-muted mb-8">Offer has been successfully redeemed and recorded.</p>
              
              <div className="bg-green-50 p-6 rounded-3xl mb-8 max-w-sm mx-auto">
                <div className="flex justify-between mb-2">
                  <span className="text-app-muted text-sm">Bill Amount</span>
                  <span className="font-bold text-app-text">₹{billAmount}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-green-700 text-lg">
                  <span>Savings</span>
                  <span>- ₹{result.savings}</span>
                </div>
              </div>

              <button 
                onClick={resetScanner}
                className="px-10 py-4 bg-green-700 text-white rounded-2xl font-display font-bold shadow-glow hover:bg-green-800 transition-all"
              >
                Scan Next
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
