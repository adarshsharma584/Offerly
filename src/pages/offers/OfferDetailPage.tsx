import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, CheckCircle2, Calendar, Users, ChevronDown, ChevronUp, Star, Bookmark, BookmarkCheck, Share2, Zap, Gift, ShieldCheck, Clock, Heart, Edit3 } from 'lucide-react';
import { OFFERS, MERCHANTS } from '@/data/mockData';
import { formatDateLong, formatDistance } from '@/utils/formatters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

export default function OfferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [savedOffers, setSavedOffers] = useLocalStorage<string[]>('offerly_saved_offers', []);

  const offer = OFFERS.find(o => o.id === id);
  const merchant = offer ? MERCHANTS.find(m => m.id === offer.merchantId) : null;

  if (!offer || !merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-app-muted">Offer not found</p>
      </div>
    );
  }

  const isSaved = savedOffers.includes(offer.id);
  const toggleSave = () => {
    if (isSaved) {
      setSavedOffers(savedOffers.filter(oid => oid !== offer.id));
      toast.success('Removed from saved');
    } else {
      setSavedOffers([...savedOffers, offer.id]);
      toast.success('Offer saved!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 glass z-20 px-5 md:px-8 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <div onClick={() => navigate(-1)} className="p-1.5 cursor-pointer hover:bg-green-50 rounded-xl transition-colors">
          <ArrowLeft size={22} className="text-app-text" />
        </div>
        <span className="font-display font-bold text-base md:text-lg text-app-text">Offer Details</span>
        <div className="flex items-center gap-2">
          <div onClick={toggleSave} className="p-1.5 cursor-pointer hover:bg-green-50 rounded-xl transition-colors">
            {isSaved ? <BookmarkCheck size={20} className="text-green-700 fill-green-700" /> : <Bookmark size={20} className="text-app-muted" />}
          </div>
          <div onClick={() => toast.info('Share feature coming soon')} className="p-1.5 cursor-pointer hover:bg-green-50 rounded-xl transition-colors">
            <Share2 size={20} className="text-app-muted" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="relative h-52 md:h-80 mx-5 md:mx-8 rounded-3xl overflow-hidden mt-2">
          <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {merchant.isAd && (
            <span className="absolute top-4 right-4 bg-gold-light/90 backdrop-blur-md text-gold text-[10px] font-display font-bold px-2.5 py-1 rounded-lg">AD</span>
          )}
          {/* Floating merchant avatar */}
          <div className="absolute -bottom-5 left-5 md:left-8 w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center text-white font-display font-bold text-xl md:text-2xl shadow-glow border-4 border-white">
            {merchant.name.charAt(0)}
          </div>
        </div>

        {/* Offer Info - Ticket Design */}
        <div className="px-5 md:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-[40px] shadow-deep overflow-hidden">
            {/* Upper part */}
            <div className="p-8 md:p-12 text-center border-b-2 border-dashed border-slate-100 relative">
              {/* Ticket notches */}
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-background rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-background rounded-full" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full text-green-700 text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                <Zap size={14} className="fill-green-700" />
                Exclusive Offer
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
                {offer.title}
              </h1>
              <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                {offer.desc}
              </p>
            </div>

            {/* Lower part */}
            <div className="p-8 md:p-10 bg-slate-50/50 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valid Until</p>
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                  <Calendar size={16} className="text-green-600" />
                  {formatDateLong(offer.validTill)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community</p>
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                  <Users size={16} className="text-green-600" />
                  {offer.uses} claimed
                </div>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant Trust</p>
                <div className="flex items-center gap-2 text-slate-900 font-display font-bold">
                  <ShieldCheck size={16} className="text-green-600" />
                  Verified Business
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="px-5 md:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-6">How to Redeem</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Visit Store', desc: 'Go to the merchant location mentioned below', icon: MapPin },
                    { title: 'Show QR', desc: 'Click on "Use Offer" and show the QR code to the staff', icon: Zap },
                    { title: 'Save Instantly', desc: 'Merchant will scan and apply the discount to your bill', icon: Gift },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-slate-50 flex items-center justify-center text-green-700 flex-shrink-0">
                        <step.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-base">{step.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-80 space-y-6">
              <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                <div onClick={() => setShowTerms(!showTerms)} className="flex items-center justify-between cursor-pointer group">
                  <h3 className="font-display font-bold text-slate-900 group-hover:text-green-700 transition-colors">Terms & Conditions</h3>
                  {showTerms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <AnimatePresence>
                  {showTerms && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3">
                        {offer.terms.split('. ').map((term, i) => (
                          <div key={i} className="flex gap-2 text-xs text-slate-500 leading-relaxed">
                            <span className="text-green-600 font-bold">•</span>
                            {term}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-display font-bold text-sm mb-2">Need Help?</h4>
                  <p className="text-white/50 text-[10px] mb-4">Contact our support team for any issues with this offer.</p>
                  <button 
                    onClick={() => navigate('/profile/support')}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
                  >
                    Contact Support
                  </button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Info Section */}
        <div className="px-5 md:px-8 pb-32">
          <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] overflow-hidden flex-shrink-0 shadow-xl">
              <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="text-2xl font-display font-bold text-slate-900">{merchant.name}</h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    <Star size={10} className="fill-green-700" /> {merchant.rating}
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={14} className="text-green-600" />
                  {(merchant as any).address || 'Golaghat, Assam'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock size={14} /> Open until 10:00 PM
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Heart size={14} className="text-red-500" /> 2.4k Favorites
                </div>
              </div>
            </div>
            <button className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-display font-bold text-sm hover:bg-slate-100 transition-all border border-slate-100">
              Visit Profile
            </button>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 glass px-5 md:px-8 py-4 md:py-6" style={{ paddingBottom: 'calc(var(--safe-bottom) + 16px)' }}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => navigate(`/offers/${id}/redeem`)}
            className="w-full gradient-accent text-white font-display font-bold text-center py-4 md:py-5 rounded-full cursor-pointer transition-all shadow-glow hover:shadow-glow-lg text-base md:text-lg"
          >
            🎁 Use Offer
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
