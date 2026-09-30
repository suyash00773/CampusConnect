import { apiClient } from './api.js';
import { Registration, PaginationInfo } from '../types/index.js';

export interface CreateRegistrationPayload {
  eventId: string;
  fullName: string;
  email: string;
  college: string;
  academicYear: string;
  phone: string;
  notes?: string;
}

export interface RegistrationSuccessResponse {
  success: boolean;
  message: string;
  data: {
    registrationId: string;
    studentName: string;
    email: string;
    college: string;
    academicYear: string;
    phone: string;
    status: string;
    registeredAt: string;
    event: {
      title: string;
      date: string;
      startTime: string;
      venue: string;
      bannerUrl: string;
    };
  };
}

export interface RegistrationQueryParams {
  eventId?: string;
  search?: string;
  academicYear?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const registrationService = {
  register: async (
    payload: CreateRegistrationPayload
  ): Promise<RegistrationSuccessResponse> => {
    return await apiClient<RegistrationSuccessResponse>('/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getRegistrations: async (
    params: RegistrationQueryParams = {}
  ): Promise<{ data: Registration[]; pagination: PaginationInfo }> => {
    return await apiClient('/registrations', { params: params as any });
  },

  deleteRegistration: async (id: string): Promise<void> => {
    await apiClient(`/registrations/${id}`, {
      method: 'DELETE',
    });
  },

  downloadCsv: async (eventId?: string): Promise<void> => {
    const blob = await apiClient<Blob>('/registrations/export/csv', {
      params: eventId ? { eventId } : undefined,
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `campusconnect-registrations-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
