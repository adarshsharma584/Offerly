import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatDistance } from '@/utils/formatters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface OfferCardProps {
  offer: { id: string; title: string; validTill: string; merchantId: string; type?: string; value?: number };
  merchant: { id: string; name: string; category: string; isVerified: boolean; isAd: boolean; distance: number; image?: string } | undefined;
  usedDate?: string;
  savings?: number;
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function OfferCard({ offer, merchant, usedDate, savings }: OfferCardProps) {
  const [savedOffers, setSavedOffers] = useLocalStorage<string[]>('offerly_saved_offers', []);
  const isSaved = savedOffers.includes(offer.id);

  if (!merchant) return null;

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      setSavedOffers(savedOffers.filter(id => id !== offer.id));
      toast.success('Removed from saved');
    } else {
      setSavedOffers([...savedOffers, offer.id]);
      toast.success('Offer saved!');
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(45,106,79,0.15)" }}
      whileTap={{ scale: 0.98 }}
      className="glass-card mb-3 md:mb-5 relative overflow-hidden group hover-lift transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/offers/${offer.id}`} className="flex flex-col h-full">
        {/* Desktop accent bar */}
        <div className="hidden md:block absolute left-0 top-0 right-0 h-[3px] bg-gradient-to-r from-green-700 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        
        {/* Top Side - Large Image */}
        <div className="w-full aspect-square relative overflow-hidden bg-gray-100">
          {merchant.image ? (
            <img 
              src={merchant.image} 
              alt={merchant.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-700 to-green-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-glow">
              {merchant.name.charAt(0)}
            </div>
          )}
          
          {/* Discount Badge - Overlay on Image */}
          {offer.value && (
            <div className="absolute top-0 left-0 p-3 z-10">
              <div className="bg-green-600 text-white text-[10px] md:text-xs font-display font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm">
                {offer.type === 'percent' ? `${offer.value}% OFF` : offer.type === 'flat' ? `₹${offer.value} OFF` : 'BOGO'}
              </div>
            </div>
          )}

          {/* Save Button - Overlay on Image */}
          <div className="absolute top-0 right-0 p-3 z-10">
            <button 
              onClick={toggleSave} 
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-green-700 transition-all shadow-lg"
            >
              {isSaved ? (
                <BookmarkCheck size={18} className="fill-current" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Side - Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col min-w-0 relative bg-white">
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-green-700 font-display font-bold text-[10px] uppercase tracking-wider">{merchant.category}</span>
              {merchant.isVerified && <CheckCircle2 size={12} className="text-green-600" />}
            </div>
            <h3 className="text-app-text font-display font-bold text-base md:text-lg truncate group-hover:text-green-700 transition-colors leading-tight">
              {merchant.name}
            </h3>
            <h2 className="text-app-muted font-display font-medium text-xs md:text-sm mt-1 line-clamp-1">
              {offer.title}
            </h2>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-app-muted text-[10px] md:text-xs font-medium">
                <MapPin size={12} className="text-green-600" />
                {formatDistance(merchant.distance)}
              </span>
              <span className="text-app-muted text-[10px] font-medium">
                Till {formatDate(offer.validTill).split(',')[0]}
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
              <ChevronRight size={18} />
            </div>
          </div>

          {usedDate && (
            <div className="absolute top-0 left-0 right-0 -translate-y-full bg-teal-600 text-white text-[10px] font-bold py-1 px-4 text-center">
              Used on {usedDate}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
