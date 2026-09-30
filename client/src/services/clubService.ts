import { apiClient } from './api.js';
import { Club } from '../types/index.js';

export const clubService = {
  getClubs: async (): Promise<Club[]> => {
    const res = await apiClient<{ success: boolean; data: Club[] }>('/clubs');
    return res.data;
  },

  getClubByIdOrSlug: async (idOrSlug: string): Promise<Club> => {
    const res = await apiClient<{ success: boolean; data: Club }>(`/clubs/${idOrSlug}`);
    return res.data;
  },

  createClub: async (clubData: Partial<Club>): Promise<Club> => {
    const res = await apiClient<{ success: boolean; data: Club }>('/clubs', {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
    return res.data;
  },

  updateClub: async (id: string, clubData: Partial<Club>): Promise<Club> => {
    const res = await apiClient<{ success: boolean; data: Club }>(`/clubs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clubData),
    });
    return res.data;
  },

  deleteClub: async (id: string): Promise<void> => {
    await apiClient(`/clubs/${id}`, {
      method: 'DELETE',
    });
  },
};
