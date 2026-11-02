import api from './api';

export type BookSessionPayload = {
  profile_slug: string;
  session_date: string; // YYYY-MM-DD
  time_slot_id: number;
  duration_minutes: number;
  notes?: string;
  conversation_id?: string;
};

export type BookSessionResponse = {
  status: boolean;
  session_id: number | string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  message: string;
  mentor_id?: string | number;
  seeker_id?: string | number;
};

export type PaymentVerificationPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  session_id: string | number;
  mentor_id?: string | number;
  seeker_id?: string | number;
  amount: number;
};

export const bookingService = {
  async book(payload: BookSessionPayload): Promise<BookSessionResponse> {
    const res = await api.post('/booking/book', payload);
    return res.data;
  },
  async verifyPayment(payload: PaymentVerificationPayload) {
    const res = await api.post('/payment/verify', payload);
    return res.data as {status: 'success' | 'failed'; message: string; session_id?: string | number};
  },
  // Returns {meeting_url, join_allowed, message, session_date_time, duration_minutes}
  async getMeetLink(meetId: string) {
    const res = await api.get('/meet', {params: {meetid: meetId}});
    return res.data;
  },
  async getMeetLinkViaToken(token: string) {
    const res = await api.get(`/meet/join/${token}`);
    return res.data;
  },
};
