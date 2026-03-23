import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_USER } from '@/data/mockData';

export type UserRole = 'user' | 'merchant' | 'admin' | 'sub_admin';
export type SubAdminCategory = 'support' | 'merchant_mgmt' | 'offer_mgmt' | 'ad_mgmt' | 'feedback' | null;

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  location?: string;
  avatar?: string | null;
  offersUsed?: number;
  totalSavings?: number;
  joinedDate?: string;
  notifications?: number;
  businessName?: string;
  category?: string;
  isVerified?: boolean;
  subAdminCategory?: SubAdminCategory; // For Sub-Admin role
  subscriptionPlan?: 'free' | 'monthly' | 'yearly' | null; // For Merchant role
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, role?: UserRole, subCat?: SubAdminCategory) => void;
  signup: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('offerly_user', null);

  const login = (phone: string, role: UserRole = 'user', subCat: SubAdminCategory = null) => {
    if (role === 'admin') {
      setUser({
        id: 'admin_001',
        name: 'Super Admin',
        phone: phone,
        email: 'admin@offerly.in',
        role: 'admin',
        location: 'Golaghat, Assam',
        notifications: 5,
      });
    } else if (role === 'sub_admin') {
      setUser({
        id: 'sub_admin_001',
        name: 'Support Executive',
        phone: phone,
        email: 'support@offerly.in',
        role: 'sub_admin',
        subAdminCategory: subCat || 'support',
        location: 'Golaghat, Assam',
        notifications: 3,
      });
    } else if (role === 'merchant') {
      setUser({
        id: 'M002',
        name: 'Rahul Sharma',
        phone: phone,
        email: 'salon@email.com',
        role: 'merchant',
        businessName: 'Style Salon',
        category: 'saloon',
        isVerified: true,
        location: 'Golaghat, Assam',
        notifications: 2,
        subscriptionPlan: 'monthly',
      });
    } else {
      setUser({
        ...MOCK_USER,
        phone: phone,
        role: 'user',
      } as User);
    }
  };

  const signup = (userData: Partial<User>) => {
    setUser(userData as User);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('offerly_phone');
    localStorage.removeItem('offerly_redemptions');
    localStorage.removeItem('offerly_saved_offers');
    localStorage.removeItem('offerly_location');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
