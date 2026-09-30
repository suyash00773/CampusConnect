import { apiClient } from './api.js';
import { AdminUser } from '../types/index.js';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: AdminUser;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      localStorage.setItem('campusconnect_token', res.token);
      localStorage.setItem('campusconnect_admin', JSON.stringify(res.admin));
    }
    return res;
  },

  getCurrentAdmin: async (): Promise<AdminUser | null> => {
    const token = localStorage.getItem('campusconnect_token');
    if (!token) return null;
    try {
      const res = await apiClient<{ success: boolean; admin: AdminUser }>('/auth/me');
      return res.admin;
    } catch {
      authService.logout();
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('campusconnect_token');
    localStorage.removeItem('campusconnect_admin');
  },
};
