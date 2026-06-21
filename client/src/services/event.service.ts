import api from './api';
import { Event, PaginatedResponse } from 'types';

export const eventService = {
  async findAll(params?: { page?: number; limit?: number; search?: string; category?: string; city?: string; status?: string }) {
    const res = await api.get<PaginatedResponse<Event>>('/events', { params });
    return res.data;
  },

  async findOne(id: string) {
    const res = await api.get<Event>(`/events/${id}`);
    return res.data;
  },

  async create(data: Partial<Event>) {
    const res = await api.post<Event>('/events', data);
    return res.data;
  },

  async update(id: string, data: Partial<Event>) {
    const res = await api.put<Event>(`/events/${id}`, data);
    return res.data;
  },

  async delete(id: string) {
    await api.delete(`/events/${id}`);
  },

  async getMyEvents() {
    const res = await api.get<Event[]>('/events/my-events');
    return res.data;
  },
};
