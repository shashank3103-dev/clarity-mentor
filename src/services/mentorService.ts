import api from './api';

export type MentorFilters = {
  search?: string;
  categories?: Array<string | number>;
  locations?: string[];
};

export type AvailabilitySlotInput = {start_time: string; end_time: string};

// Public (no-auth) catalogue endpoints + mentor-role endpoints, mirroring web MentorService.
export const mentorService = {
  async getMentors(page = 1, limit = 10, filters: MentorFilters = {}) {
    const params: Record<string, any> = {skip: (page - 1) * limit, limit};
    if (filters.search) params.search = filters.search;
    if (filters.locations?.length) params.locations = filters.locations.join(',');
    if (filters.categories?.length) params.categories_ids = filters.categories.join(',');
    const res = await api.get('/home/mentors', {params});
    return res.data;
  },
  async getPinnedMentors() {
    const res = await api.get('/home/pinned-mentors');
    return res.data;
  },
  async getCategories() {
    const res = await api.get('/admin/categories');
    return res.data;
  },
  async getSuccessStories(page = 1, limit = 30) {
    const res = await api.get('/home/success-stories', {params: {page, limit}});
    return res.data;
  },
  async getMentorProfile(slug: string) {
    const res = await api.get(`/mentor/profile/${slug}`);
    return res.data;
  },
  async getAvailability(slug: string) {
    const res = await api.get(`/mentor/availability/settings/${slug}`);
    return res.data;
  },

  // ---- Mentor role ----
  async getDashboard() {
    const res = await api.get('/mentor/dashboard');
    return res.data;
  },
  async getSessions(page = 1, limit = 10, startDate?: string, endDate?: string) {
    const res = await api.get('/mentor/sessions', {
      params: {
        page,
        limit,
        ...(startDate && {start_date: startDate}),
        ...(endDate && {end_date: endDate}),
      },
    });
    return res.data;
  },
  async markSessionComplete(sessionId: string | number) {
    const res = await api.post('/mentor/mark-session-complete', {session_id: sessionId});
    return res.data;
  },
  async updateProfile(data: {
    full_name: string;
    bio: string;
    hourly_rate: number;
    expertise_area: string;
    category_ids: number[];
  }) {
    const res = await api.post('/mentor/profile/update', data);
    return res.data;
  },
  async updateAvailability(data: {
    schedule_type: string;
    selected_days: number[];
    slots: AvailabilitySlotInput[];
  }) {
    const res = await api.post('/mentor/availability/settings', data);
    return res.data;
  },
  async getPaymentHistory(search = '', page = 1, limit = 10) {
    const res = await api.get('/payment/mentor/history', {params: {search, page, limit}});
    return res.data;
  },
  async addBankAccount(data: Record<string, any>) {
    const res = await api.post('/mentor/add-account', data);
    return res.data;
  },
  async addBankDetails(data: {
    account_number: string;
    ifsc_code: string;
    beneficiary_name: string;
    pan_number?: string;
    gst_number?: string;
  }) {
    const res = await api.post('/mentor/add-bank-details', data);
    return res.data;
  },
};

export const getMentors = mentorService.getMentors;
