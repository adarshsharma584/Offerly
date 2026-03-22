import { useMemo } from 'react';
import { OFFERS, MERCHANTS } from '@/data/mockData';
import { sortOffers } from '@/utils/sortOffers';

export function useOffers(category: string = 'all', searchQuery: string = '') {
  return useMemo(() => {
    let filtered = OFFERS.filter(o => o.status === 'active');

    if (category !== 'all') {
      filtered = filtered.filter(o => {
        const m = MERCHANTS.find(m => m.id === o.merchantId);
        return m?.category === category;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => {
        const m = MERCHANTS.find(m => m.id === o.merchantId);
        return (
          o.title.toLowerCase().includes(q) ||
          o.desc.toLowerCase().includes(q) ||
          m?.name.toLowerCase().includes(q) ||
          m?.category.toLowerCase().includes(q)
        );
      });
    }

    return sortOffers(filtered, MERCHANTS);
  }, [category, searchQuery]);
}
