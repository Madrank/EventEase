import api from './api';
import { Guest } from 'types';

export const guestService = {
  async findAll(eventId: string, status?: string) {
    const res = await api.get<Guest[]>(`/events/${eventId}/guests`, { params: { status } });
    return res.data;
  },

  async add(eventId: string, data: { email: string; firstName?: string; lastName?: string; phone?: string }) {
    const res = await api.post<Guest>(`/events/${eventId}/guests`, data);
    return res.data;
  },

  async bulkAdd(eventId: string, guests: { email: string; firstName?: string; lastName?: string }[]) {
    const res = await api.post(`/events/${eventId}/guests/bulk`, { guests });
    return res.data;
  },

  async updateStatus(id: string, status: string) {
    const res = await api.put<Guest>(`/events/guests/${id}/status`, { status });
    return res.data;
  },

  async remove(id: string) {
    await api.delete(`/events/guests/${id}`);
  },
};
