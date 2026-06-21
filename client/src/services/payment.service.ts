import api from './api';

export const paymentService = {
  createCheckoutSession: async (data: {
    contributionId?: string;
    eventId?: string;
    amount: number;
    metadata?: { name?: string; description?: string };
  }) => {
    const res = await api.post('/payments/create-checkout-session', data);
    return res.data;
  },
};
