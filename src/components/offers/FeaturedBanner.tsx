import { motion } from 'framer-motion';
import { ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface FeaturedBannerProps {
  offer: { id: string; title: string };
  merchant: { name: string; image: string; distance: number; isAd: boolean };
}

export default function FeaturedBanner({ offer, merchant }: FeaturedBannerProps) {
  const [savedOffers, setSavedOffers] = useLocalStorage<string[]>('offerly_saved_offers', []);
  const isSaved = savedOffers.includes(offer.id);

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
    <Link to={`/offers/${offer.id}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -3 }}
        className="relative h-52 rounded-3xl overflow-hidden shadow-card-lg group"
      >
        <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div onClick={toggleSave} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/10 hover:bg-white/30 transition-all">
            {isSaved ? <BookmarkCheck size={16} className="text-white" /> : <Bookmark size={16} className="text-white" />}
          </div>
          {merchant.isAd && (
            <div className="bg-gold-light/90 backdrop-blur-md text-gold text-[10px] font-display font-bold px-2.5 py-1 rounded-lg">AD</div>
          )}
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-white/80 text-xs font-bold mb-1">{merchant.name}</p>
          <h3 className="text-white text-xl font-display font-bold mb-3 leading-tight">{offer.title}</h3>
          <div className="flex items-center justify-between">
            <span className="bg-white/15 backdrop-blur-lg text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10">
              📍 {merchant.distance} km away
            </span>
            <span className="gradient-accent text-white text-xs font-display font-bold px-4 py-2 rounded-full flex items-center gap-1 shadow-glow">
              View Offer <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
