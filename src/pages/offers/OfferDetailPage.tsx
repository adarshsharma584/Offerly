import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CheckCircle2, Calendar, Users, ChevronDown, ChevronUp, Star, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
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

        {/* Merchant Info */}
        <div className="px-5 md:px-8 pt-8 md:pt-10 pb-3 border-b border-green-50">
          <h2 className="font-display font-bold text-xl md:text-2xl text-app-text">{merchant.name}</h2>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-app-muted text-xs md:text-sm capitalize bg-green-50 px-2 py-0.5 rounded-full">{merchant.category}</span>
            <span className="flex items-center gap-1 text-app-muted text-xs md:text-sm"><MapPin size={11} className="text-green-600" /> {formatDistance(merchant.distance)}</span>
            <span className="flex items-center gap-1 text-app-muted text-xs md:text-sm"><Star size={11} className="text-amber-500 fill-amber-500" /> {merchant.rating}</span>
            {merchant.isVerified && (
              <span className="flex items-center gap-1 text-green-700 text-xs md:text-sm bg-green-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={11} /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Offer Info */}
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-green-50">
          <h1 className="font-display font-bold text-[22px] md:text-3xl text-gradient mb-2">{offer.title}</h1>
          <p className="text-app-muted text-sm md:text-base mb-3">{offer.desc}</p>
          <div className="flex flex-wrap gap-3">
            <div className="glass-card !rounded-xl px-3 py-2 flex items-center gap-2">
              <Calendar size={14} className="text-green-600" />
              <span className="text-xs md:text-sm text-app-text">Valid till {formatDateLong(offer.validTill)}</span>
            </div>
            <div className="glass-card !rounded-xl px-3 py-2 flex items-center gap-2">
              <Users size={14} className="text-green-600" />
              <span className="text-xs md:text-sm text-app-text">{offer.uses} people used</span>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-green-50">
          <h3 className="font-display font-bold text-base md:text-lg text-app-text mb-3">How to Use</h3>
          <div className="space-y-2.5">
            {['Visit the store', 'Show this offer to staff', 'Get instant discount'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg gradient-accent flex items-center justify-center text-white font-display font-bold text-xs md:text-sm shadow-glow flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm md:text-base text-app-mid">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-green-50">
          <div onClick={() => setShowTerms(!showTerms)} className="flex items-center justify-between cursor-pointer">
            <h3 className="font-display font-bold text-base md:text-lg text-app-text">Terms & Conditions</h3>
            {showTerms ? <ChevronUp size={20} className="text-app-muted" /> : <ChevronDown size={20} className="text-app-muted" />}
          </div>
          {showTerms && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-1.5">
              {offer.terms.split('. ').map((term, i) => (
                <p key={i} className="text-sm md:text-base text-app-muted flex items-start gap-2">
                  <span className="text-green-700 font-bold">•</span> {term.replace('.', '')}
                </p>
              ))}
            </motion.div>
          )}
        </div>

        {/* About */}
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-green-50">
          <h3 className="font-display font-bold text-base md:text-lg text-app-text mb-2">About {merchant.name}</h3>
          <p className="text-sm md:text-base text-app-muted flex items-center gap-2 mb-1"><MapPin size={14} className="text-green-600" /> {(merchant as any).address || 'Golaghat, Assam'}</p>
          <p className="text-sm md:text-base text-app-muted flex items-center gap-2">📞 {(merchant as any).phone || '+91 98765 43210'}</p>
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
