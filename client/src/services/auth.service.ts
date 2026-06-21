import api from './api';
import { AuthResponse, User } from 'types';

export const authService = {
  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(email: string, password: string) {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  async getProfile() {
    const res = await api.get<User>('/auth/profile');
    return res.data;
  },
};
