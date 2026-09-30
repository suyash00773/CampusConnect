import { apiClient } from './api.js';
import { DashboardStats } from '../types/index.js';

export const statsService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient<{ success: boolean; data: DashboardStats }>('/stats');
    return res.data;
  },

  seedDatabase: async (): Promise<{ success: boolean; message: string }> => {
    return await apiClient('/stats/seed', {
      method: 'POST',
    });
  },
};
