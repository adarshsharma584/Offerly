import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_USER } from '@/data/mockData';
import api from '@/lib/api';

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
  subAdminCategory?: SubAdminCategory;
  subscriptionPlan?: 'free' | 'monthly' | 'yearly' | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, role?: UserRole, subCat?: SubAdminCategory) => Promise<void>;
  signup: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('offerly_user', null);
  const [loading, setLoading] = React.useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('offerly_access_token');
    if (token) {
      try {
        const response = await api.getMe();
        if (response.success && response.data) {
          const userData = {
            id: response.data._id || response.data.id,
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email || '',
            role: response.data.role,
            location: response.data.location?.city,
            avatar: response.data.avatar,
            offersUsed: response.data.offersUsed || 0,
            totalSavings: response.data.totalSavings || 0,
            businessName: response.data.businessName,
            category: response.data.category,
            isVerified: response.data.isVerified,
            subAdminCategory: response.data.subAdminCategory,
            subscriptionPlan: response.data.subscriptionPlan,
            notifications: response.data.notifications || 0,
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('offerly_access_token');
        localStorage.removeItem('offerly_refresh_token');
      }
    }
  };

  const login = async (phone: string, role: UserRole = 'user', subCat: SubAdminCategory = null) => {
    setLoading(true);
    try {
      await api.sendOTP(phone);
    } catch (error) {
      console.log('OTP send failed, using mock mode');
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
        setLoading(false);
        return;
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
        setLoading(false);
        return;
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
        setLoading(false);
        return;
      } else {
        setUser({
          ...MOCK_USER,
          phone: phone,
          role: 'user',
        } as User);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  const verifyAndSetUser = async (phone: string, otp: string, role: UserRole = 'user') => {
    setLoading(true);
    try {
      const response = await api.verifyOTP(phone, otp, role);
      if (response.success && response.data) {
        const userData = {
          id: response.data.user?._id || response.data.user?.id || response.data.id,
          name: response.data.user?.name || 'User',
          phone: response.data.user?.phone || phone,
          email: response.data.user?.email || '',
          role: response.data.user?.role || role,
          location: response.data.user?.location?.city,
          avatar: response.data.user?.avatar,
          offersUsed: response.data.user?.offersUsed || 0,
          totalSavings: response.data.user?.totalSavings || 0,
          businessName: response.data.user?.businessName,
          category: response.data.user?.category,
          isVerified: response.data.user?.isVerified,
          subAdminCategory: response.data.user?.subAdminCategory,
          subscriptionPlan: response.data.user?.subscriptionPlan,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = (userData: Partial<User>) => {
    setUser(userData as User);
  };

  const logout = () => {
    api.logout().catch(() => {});
    setUser(null);
    localStorage.removeItem('offerly_phone');
    localStorage.removeItem('offerly_redemptions');
    localStorage.removeItem('offerly_saved_offers');
    localStorage.removeItem('offerly_location');
    localStorage.removeItem('offerly_access_token');
    localStorage.removeItem('offerly_refresh_token');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
