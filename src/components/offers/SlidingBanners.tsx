import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OFFERS, MERCHANTS } from '@/data/mockData';
import { sortOffers } from '@/utils/sortOffers';

const bannerGradients = [
  'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
  'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)',
  'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
];

export default function SlidingBanners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topOffers = sortOffers(OFFERS.filter(o => o.status === 'active'), MERCHANTS).slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % topOffers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [topOffers.length]);

  const offer = topOffers[currentIndex];
  const merchant = MERCHANTS.find(m => m.id === offer?.merchantId);
  if (!offer || !merchant) return null;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to={`/offers/${offer.id}`}>
            <div
              className="relative rounded-3xl overflow-hidden p-5 md:p-6 min-h-[160px] flex flex-col justify-between"
              style={{ background: bannerGradients[currentIndex % bannerGradients.length] }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-display font-bold text-sm border border-white/10">
                    {merchant.name.charAt(0)}
                  </div>
                  <span className="text-white/70 text-xs font-display font-semibold">{merchant.name}</span>
                  {merchant.isAd && (
                    <span className="bg-gold-light/80 text-gold text-[9px] font-display font-bold px-1.5 py-0.5 rounded">AD</span>
                  )}
                </div>
                <h3 className="text-white font-display font-bold text-lg md:text-xl leading-tight max-w-[80%]">{offer.title}</h3>
              </div>

              <div className="flex items-center justify-between mt-3 relative z-10">
                <span className="text-white/50 text-[11px]">📍 {merchant.distance} km away</span>
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-display font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10">
                  Redeem <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {topOffers.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`cursor-pointer rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-6 h-1.5 bg-green-700' : 'w-1.5 h-1.5 bg-green-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
