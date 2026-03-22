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
      className="glass-card mb-3 md:mb-5 relative overflow-hidden group hover-lift transition-all duration-300"
    >
      <Link to={`/offers/${offer.id}`} className="flex items-stretch min-h-[120px] md:min-h-[140px]">
        {/* Desktop left accent bar */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-700 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
        
        {/* Left Side - Large Image */}
        <div className="w-28 md:w-36 lg:w-44 flex-shrink-0 relative overflow-hidden bg-gray-100">
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
            <div className="absolute top-0 left-0 p-2 z-10">
              <div className="bg-green-600 text-white text-[8px] md:text-[10px] font-display font-bold px-2 py-1 rounded-br-lg shadow-lg">
                {offer.type === 'percent' ? `${offer.value}% OFF` : offer.type === 'flat' ? `₹${offer.value} OFF` : 'BOGO'}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 p-3 md:p-4 lg:p-5 flex flex-col justify-between min-w-0 relative">
          <div>
            <div className="flex items-start justify-between mb-1.5 md:mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-app-text font-display font-bold text-sm md:text-base lg:text-lg truncate group-hover:text-green-700 transition-colors">
                    {merchant.name}
                  </h3>
                  {merchant.isVerified && <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />}
                </div>
                <h2 className="text-app-muted font-display font-medium text-[12px] md:text-[14px] leading-tight line-clamp-2">
                  {offer.title}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {merchant.isAd && (
                  <span className="bg-gold-light/20 text-gold text-[7px] md:text-[8px] font-display font-bold px-1.5 py-0.5 rounded border border-gold/10">
                    AD
                  </span>
                )}
                <div onClick={toggleSave} className="p-1.5 -m-1.5 cursor-pointer hover:scale-110 transition-transform">
                  {isSaved ? (
                    <BookmarkCheck size={18} className="text-green-700 fill-green-700" />
                  ) : (
                    <Bookmark size={18} className="text-app-muted group-hover:text-green-600 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50/50">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="flex items-center gap-1 bg-green-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-green-700 text-[9px] md:text-[10px] font-bold whitespace-nowrap">
                <MapPin size={10} />
                {formatDistance(merchant.distance)}
              </span>
              
              {usedDate ? (
                <span className="bg-teal-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-teal-700 text-[9px] md:text-[10px] font-bold">
                  Used on {usedDate}
                </span>
              ) : (
                <span className="text-app-muted text-[9px] md:text-[10px] font-medium">
                  Till {formatDate(offer.validTill).split(',')[0]}
                </span>
              )}

              {savings !== undefined && (
                <span className="text-green-700 font-display font-bold text-[9px] md:text-[10px] bg-green-50 px-2 py-0.5 rounded-full">
                  Saved ₹{savings}
                </span>
              )}
            </div>
            
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all flex-shrink-0 ml-2">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
