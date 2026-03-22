import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/mockData';
import {
  LayoutGrid, UtensilsCrossed, Scissors, Store, Dumbbell, Wrench,
  Pill, Smartphone, Shirt, Gamepad2
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Scissors: <Scissors size={18} />,
  Store: <Store size={18} />,
  Dumbbell: <Dumbbell size={18} />,
  Wrench: <Wrench size={18} />,
  Pill: <Pill size={18} />,
  Smartphone: <Smartphone size={18} />,
  Shirt: <Shirt size={18} />,
  Gamepad2: <Gamepad2 size={18} />,
};

interface CategoryGridProps {
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryGrid({ activeCategory, onSelect }: CategoryGridProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
      {CATEGORIES.map(cat => (
        <motion.div
          key={cat.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all text-xs font-display font-bold whitespace-nowrap ${
            activeCategory === cat.id
              ? 'gradient-accent border-transparent text-white shadow-glow'
              : 'glass-card !border-white/40 text-app-text hover:shadow-glass'
          }`}
        >
          <span className={activeCategory === cat.id ? 'text-white' : 'text-green-700'}>
            {iconMap[cat.icon]}
          </span>
          {cat.label}
        </motion.div>
      ))}
    </div>
  );
}
