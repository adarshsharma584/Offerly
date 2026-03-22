import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MERCHANTS, OFFERS, REDEMPTION_HISTORY, LIVE_ACTIVITY, MOCK_USERS } from '@/data/mockData';

interface PlatformData {
  merchants: any[];
  offers: any[];
  redemptions: any[];
  liveActivity: any[];
  users: any[];
}

interface PlatformDataContextType {
  data: PlatformData;
  updateMerchant: (id: string, updates: any) => void;
  updateOffer: (id: string, updates: any) => void;
  addRedemption: (redemption: any) => void;
  addOffer: (offer: any) => void;
  addMerchant: (merchant: any) => void;
  updateUser: (id: string, updates: any) => void;
}

const PlatformDataContext = createContext<PlatformDataContextType | null>(null);

export function PlatformDataProvider({ children }: { children: ReactNode }) {
  const [merchants, setMerchants] = useLocalStorage('offerly_merchants', MERCHANTS);
  const [offers, setOffers] = useLocalStorage('offerly_offers', OFFERS);
  const [redemptions, setRedemptions] = useLocalStorage('offerly_redemptions_all', REDEMPTION_HISTORY);
  const [liveActivity, setLiveActivity] = useLocalStorage('offerly_live_activity', LIVE_ACTIVITY);
  const [users, setUsers] = useLocalStorage('offerly_users', MOCK_USERS);

  const updateMerchant = (id: string, updates: any) => {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const updateOffer = (id: string, updates: any) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const addRedemption = (redemption: any) => {
    const newRedemption = { ...redemption, id: `R${Date.now()}` };
    setRedemptions(prev => [newRedemption, ...prev]);
    const newActivity = {
      id: Date.now(),
      text: `Offer redeemed by ${redemption.customerName}`,
      time: 'Just now',
      type: 'redemption'
    };
    setLiveActivity(prev => [newActivity, ...prev.slice(0, 19)]);
  };

  const addOffer = (offer: any) => {
    setOffers(prev => [offer, ...prev]);
  };

  const addMerchant = (merchant: any) => {
    setMerchants(prev => [merchant, ...prev]);
  };

  const updateUser = (id: string, updates: any) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  return (
    <PlatformDataContext.Provider value={{
      data: { merchants, offers, redemptions, liveActivity, users },
      updateMerchant,
      updateOffer,
      addRedemption,
      addOffer,
      addMerchant,
      updateUser
    }}>
      {children}
    </PlatformDataContext.Provider>
  );
}

export function usePlatformData() {
  const ctx = useContext(PlatformDataContext);
  if (!ctx) throw new Error('usePlatformData must be used within PlatformDataProvider');
  return ctx;
}
