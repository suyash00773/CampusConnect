import { apiClient } from './api.js';
import { Event, PaginationInfo } from '../types/index.js';

export interface EventQueryParams {
  search?: string;
  category?: string;
  club?: string;
  timeframe?: 'upcoming' | 'past' | 'all';
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const eventService = {
  getEvents: async (
    params: EventQueryParams = {}
  ): Promise<{ data: Event[]; pagination: PaginationInfo }> => {
    return await apiClient('/events', { params: params as any });
  },

  getFeaturedEvents: async (): Promise<{
    featured: Event | null;
    upcoming: Event[];
  }> => {
    const res = await apiClient<{ success: boolean; data: { featured: Event | null; upcoming: Event[] } }>(
      '/events/featured'
    );
    return res.data;
  },

  getEventByIdOrSlug: async (idOrSlug: string): Promise<Event> => {
    const res = await apiClient<{ success: boolean; data: Event }>(`/events/${idOrSlug}`);
    return res.data;
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    const res = await apiClient<{ success: boolean; data: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return res.data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    const res = await apiClient<{ success: boolean; data: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return res.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};
