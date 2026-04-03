const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('offerly_access_token');
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    return url.toString();
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getAuthToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Request failed',
          error: data.error,
        };
      }

      return data;
    } catch (error: any) {
      if (error.status === 401) {
        localStorage.removeItem('offerly_access_token');
        localStorage.removeItem('offerly_user');
        window.location.href = '/login';
      }
      throw error;
    }
  }

  // Auth endpoints
  async sendOTP(phone: string) {
    const response = await this.request<any>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
    return response;
  }

  async verifyOTP(phone: string, otp: string, role: string = 'user') {
    const response = await this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, role }),
    });
    
    if (response.data?.accessToken) {
      localStorage.setItem('offerly_access_token', response.data.accessToken);
      localStorage.setItem('offerly_refresh_token', response.data.refreshToken);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('offerly_access_token');
      localStorage.removeItem('offerly_refresh_token');
    }
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // User endpoints
  async getUserProfile() {
    return this.request<any>('/users/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getOffers(params?: any) {
    return this.request<any>('/users/offers', { params });
  }

  async getOfferById(id: string) {
    return this.request<any>(`/users/offers/${id}`);
  }

  async getMyOffers(params?: any) {
    return this.request<any>('/users/offers/my', { params });
  }

  async claimOffer(offerId: string) {
    return this.request<any>(`/users/offers/${offerId}/claim`, {
      method: 'POST',
    });
  }

  async generateQR(redemptionId: string) {
    return this.request<any>(`/users/redemptions/${redemptionId}/generate-qr`, {
      method: 'POST',
    });
  }

  async getRedemptionHistory(params?: any) {
    return this.request<any>('/users/redemptions/history', { params });
  }

  async getRedemptionStatus(redemptionId: string) {
    return this.request<any>(`/users/redemptions/${redemptionId}/status`);
  }

  async getCategories() {
    return this.request<any>('/users/offers/categories');
  }

  // Merchant endpoints
  async registerMerchant(data: any) {
    return this.request<any>('/merchant/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMerchantProfile() {
    return this.request<any>('/merchant/profile');
  }

  async updateMerchantProfile(data: any) {
    return this.request<any>('/merchant/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getMerchantDashboard() {
    return this.request<any>('/merchant/dashboard');
  }

  async createOffer(data: any) {
    return this.request<any>('/merchant/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMerchantOffers(params?: any) {
    return this.request<any>('/merchant/offers', { params });
  }

  async updateOffer(id: string, data: any) {
    return this.request<any>(`/merchant/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOffer(id: string) {
    return this.request<any>(`/merchant/offers/${id}`, {
      method: 'DELETE',
    });
  }

  async scanQR(qrToken: string, billAmount: number) {
    return this.request<any>('/merchant/scan', {
      method: 'POST',
      body: JSON.stringify({ qrToken, billAmount }),
    });
  }

  async getMerchantRedemptions(params?: any) {
    return this.request<any>('/merchant/redemptions', { params });
  }

  async createAd(data: any) {
    return this.request<any>('/merchant/ads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMerchantAds(params?: any) {
    return this.request<any>('/merchant/ads', { params });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request<any>('/admin/dashboard');
  }

  async getAdminMerchants(params?: any) {
    return this.request<any>('/admin/merchants', { params });
  }

  async updateAdminMerchant(id: string, data: any) {
    return this.request<any>(`/admin/merchants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminOffers(params?: any) {
    return this.request<any>('/admin/offers', { params });
  }

  async getAdminAds(params?: any) {
    return this.request<any>('/admin/ads', { params });
  }

  async getAdminUsers(params?: any) {
    return this.request<any>('/admin/users', { params });
  }

  async getAdminAnalytics() {
    return this.request<any>('/admin/analytics');
  }

  async getAdminStaff() {
    return this.request<any>('/admin/staff');
  }

  async createAdminStaff(data: any) {
    return this.request<any>('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdminStaff(id: string, data: any) {
    return this.request<any>(`/admin/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminStaff(id: string) {
    return this.request<any>(`/admin/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Sub-Admin endpoints
  async getSubAdminDesk() {
    return this.request<any>('/subadmin/desk');
  }

  async getSubAdminMerchants() {
    return this.request<any>('/subadmin/merchants');
  }

  async approveSubAdminMerchant(id: string, action: 'approve' | 'reject') {
    return this.request<any>(`/subadmin/merchants/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  async getSubAdminOffers() {
    return this.request<any>('/subadmin/offers');
  }

  async approveSubAdminOffer(id: string, action: 'approve' | 'reject') {
    return this.request<any>(`/subadmin/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  async getSubAdminAds() {
    return this.request<any>('/subadmin/ads');
  }

  async approveSubAdminAd(id: string, action: 'approve' | 'reject') {
    return this.request<any>(`/subadmin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  }

  async getSubAdminTickets(params?: any) {
    return this.request<any>('/subadmin/tickets', { params });
  }

  async resolveSubAdminTicket(id: string, response: string) {
    return this.request<any>(`/subadmin/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ response }),
    });
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
