import { motion } from 'framer-motion';
import { MapPin, Star, CheckCircle2 } from 'lucide-react';
import { formatDistance } from '@/utils/formatters';
import { OFFERS } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

interface MerchantCardProps {
  merchant: {
    id: string;
    name: string;
    category: string;
    distance: number;
    isVerified: boolean;
    isAd: boolean;
    image: string;
    rating: number;
    address?: string;
    lat?: number;
    lng?: number;
  };
}

export default function MerchantCard({ merchant }: MerchantCardProps) {
  const navigate = useNavigate();
  const offerCount = OFFERS.filter(o => o.merchantId === merchant.id && o.status === 'active').length;
  const firstOffer = OFFERS.find(o => o.merchantId === merchant.id && o.status === 'active');

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => firstOffer && navigate(`/offers/${firstOffer.id}`)}
      className="glass-card overflow-hidden cursor-pointer hover-lift group max-w-[200px] md:max-w-none mx-auto w-full"
    >
      <div className="relative h-24 md:h-28 overflow-hidden">
        <img
          src={merchant.image}
          alt={merchant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {merchant.isAd && (
          <span className="absolute top-1.5 right-1.5 bg-gold-light/90 backdrop-blur-md text-gold text-[8px] md:text-[9px] font-display font-bold px-1.5 py-0.5 rounded">AD</span>
        )}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-1.5 py-0.5 border border-white/10">
          <Star size={8} className="text-amber-400 fill-amber-400 md:w-[10px] md:h-[10px]" />
          <span className="text-white text-[9px] md:text-[10px] font-bold">{merchant.rating}</span>
        </div>
      </div>
      <div className="p-2.5 md:p-3">
        <div className="flex items-center gap-1 mb-0.5 md:mb-1">
          <h4 className="font-display font-bold text-xs md:text-sm text-app-text truncate">{merchant.name}</h4>
          {merchant.isVerified && <CheckCircle2 size={10} className="text-green-600 flex-shrink-0 md:w-[12px] md:h-[12px]" />}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-app-muted text-[9px] md:text-[10px] capitalize flex items-center gap-1">
            <MapPin size={9} className="text-green-600 md:w-[10px] md:h-[10px]" />
            {formatDistance(merchant.distance)}
          </span>
          <span className="text-green-700 text-[8px] md:text-[10px] font-display font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
            {offerCount} {offerCount === 1 ? 'offer' : 'offers'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
