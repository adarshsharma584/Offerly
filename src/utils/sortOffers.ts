type AdTier = 'premium' | 'growth' | 'starter';

const adTierWeight: Record<AdTier, number> = { premium: 3, growth: 2, starter: 1 };

interface Merchant {
  id: string;
  isAd: boolean;
  adTier: AdTier | null;
  distance: number;
}

interface Offer {
  merchantId: string;
}

export function sortOffers<T extends Offer>(offers: T[], merchants: Merchant[]): T[] {
  return [...offers].sort((a, b) => {
    const mA = merchants.find(m => m.id === a.merchantId);
    const mB = merchants.find(m => m.id === b.merchantId);
    if (!mA || !mB) return 0;
    const weightA = mA.isAd && mA.adTier ? adTierWeight[mA.adTier] : 0;
    const weightB = mB.isAd && mB.adTier ? adTierWeight[mB.adTier] : 0;
    if (weightA !== weightB) return weightB - weightA;
    return mA.distance - mB.distance;
  });
}
