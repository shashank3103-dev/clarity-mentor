import api from './api';

export const seekerService = {
  async getDashboard() {
    const res = await api.get('/seeker/dashboard');
    return res.data;
  },
  async getSessions(page = 1, limit = 10, startDate?: string, endDate?: string) {
    const res = await api.get('/seeker/sessions', {
      params: {
        page,
        limit,
        ...(startDate && {start_date: startDate}),
        ...(endDate && {end_date: endDate}),
      },
    });
    return res.data;
  },
  async getSessionById(sessionId: string | number) {
    const res = await api.get(`/seeker/session/${sessionId}`);
    return res.data;
  },
  async markSessionComplete(sessionId: string | number) {
    const res = await api.post('/seeker/mark-session-complete', {session_id: sessionId});
    return res.data;
  },
  async addReview(sessionId: string | number, rating: number, review: string) {
    const res = await api.post('/review/add', {session_id: sessionId, rating, review});
    return res.data;
  },
  async addOutcomeReview(sessionId: number, rating: number, feedback: string) {
    const res = await api.post('/review/outcome', {session_id: sessionId, rating, feedback});
    return res.data;
  },
  async getPaymentHistory(search = '', page = 1, limit = 10) {
    const res = await api.get('/payment/seeker/history', {params: {search, page, limit}});
    return res.data;
  },
};

export const commonService = {
  async contactUs(data: {name: string; phone: string; email: string; message: string}) {
    const res = await api.post('/user/contact-us', data);
    return res.data;
  },
};
