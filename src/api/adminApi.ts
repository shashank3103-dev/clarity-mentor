import api from './axiosInstance';

/**
 * Admin Panel APIs.
 *
 * Covers dashboard stats, mentor/seeker/agent management, categories,
 * reviews, blogs, recordings, stories, and platform operations.
 */

/* ── Auth & Account ────────────────────────────────────────── */
export const adminLogin = (data: {email: string; password: string}) =>
  api.post('/admin/login', data);

export const getAdminMe = () =>
  api.get('/admin/me');

export const updateAdminPassword = (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => api.post('/admin/update-password', data);

export const getAdminStats = () =>
  api.get('/admin/stats');

/* ── Mentors ────────────────────────────────────────────────── */
export const getAdminMentorList = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}) => api.get('/admin/mentor-list', {params});

export const getAdminMentorById = (id: string | number) =>
  api.get(`/admin/mentor/${id}`);

export const updateAdminMentor = (id: string | number, data: object) =>
  api.put(`/admin/mentor/${id}`, data);

export const updateAdminMentorStatus = (
  id: string | number,
  status: 'approved' | 'rejected' | string,
) => api.post(`/admin/mentor/${id}/status`, {status});

export const getAdminMentorBankDetails = (params?: {
  page?: number;
  limit?: number;
}) => api.get('/admin/mentor-bank-details', {params});

export const updateAdminMentorBankStatus = (
  mentorId: string | number,
  status: string,
) => api.put(`/admin/mentor-bank-account/${mentorId}/status`, {status});

export const pinAdminMentor = (mentorId: string | number) =>
  api.post('/admin/pin-mentor', {mentor_id: mentorId});

export const unpinAdminMentor = (mentorId: string | number) =>
  api.post('/admin/unpin-mentor', {mentor_id: mentorId});

/* ── Seekers ────────────────────────────────────────────────── */
export const getAdminSeekerList = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}) => api.get('/admin/seeker-list', {params});

export const getAdminSeekerById = (id: string | number) =>
  api.get(`/admin/seeker/${id}`);

export const updateAdminSeekerStatus = (id: string | number, status: string) =>
  api.put(`/admin/seeker/${id}/status`, {status});

/* ── Agents ─────────────────────────────────────────────────── */
export const getAdminAgentList = () =>
  api.get('/admin/agent-list');

export const addAdminAgent = (data: object) =>
  api.post('/admin/add-agent', data);

export const updateAdminAgent = (data: object) =>
  api.put('/admin/update-agent', data);

export const deleteAdminAgent = (id: string | number) =>
  api.delete(`/admin/agent/${id}`);

/* ── Payments ───────────────────────────────────────────────── */
export const releaseAdminPayment = (data: object) =>
  api.post('/admin/payment/release', data);

/* ── Categories ─────────────────────────────────────────────── */
export const getAdminCategories = () =>
  api.get('/admin/categories');

export const addAdminCategory = (data: {name: string; [key: string]: any}) =>
  api.post('/admin/category', data);

export const updateAdminCategory = (id: string | number, data: object) =>
  api.put(`/admin/category/${id}`, data);

export const deleteAdminCategory = (id: string | number) =>
  api.delete(`/admin/category/${id}`);

/* ── Newsletter & Stories ───────────────────────────────────── */
export const getAdminNewsletterSubscribers = (params?: {
  page?: number;
  limit?: number;
}) => api.get('/admin/news/subscribers', {params});

export const addAdminSuccessStory = (formData: FormData) =>
  api.post('/admin/success-stories', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

export const getAdminSuccessStories = (params?: {
  page?: number;
  limit?: number;
}) => api.get('/admin/success-stories', {params});

export const updateAdminSuccessStory = (
  id: string | number,
  formData: FormData,
) =>
  api.put(`/admin/success-stories/${id}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

export const deleteAdminSuccessStory = (id: string | number) =>
  api.delete(`/admin/success-stories/${id}`);

/* ── Email Templates ────────────────────────────────────────── */
export const getAdminEmailTemplates = () =>
  api.get('/admin/email-templates');

export const updateAdminEmailTemplate = (id: string | number, data: object) =>
  api.put(`/admin/email-templates/${id}`, data);

/* ── Contact-Us ─────────────────────────────────────────────── */
export const getAdminContactUsRequests = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => api.get('/admin/contact-us', {params});

export const updateAdminContactUsStatus = (
  id: string | number,
  status: string,
) => api.put(`/admin/contact-us/${id}/status`, {status});

export const deleteAdminContactUs = (id: string | number) =>
  api.delete(`/admin/contact-us/${id}`);

/* ── Quality Score & Content ─────────────────────────────────── */
export const getAdminMentorQualityScore = (id: string | number) =>
  api.get(`/admin/mentor-quality-score/${id}`);

export const saveAdminMentorContent = (data: object) =>
  api.post('/admin/mentor-content', data);

export const getAdminMentorContent = (id: string | number) =>
  api.get(`/admin/mentor-content/${id}`);

export const deleteAdminMentorContent = (id: string | number) =>
  api.delete(`/admin/mentor-content/${id}`);

/* ── Recordings & Rooms ─────────────────────────────────────── */
export const getAdminRecordings = (roomId: string) =>
  api.get(`/admin/recordings/${roomId}`);

export const getAdminRecordingDownloadUrl = (recordingId: string) =>
  api.get(`/admin/recordings-url/${recordingId}`);

export const deleteAdminRecording = (recordingId: string) =>
  api.delete(`/admin/recordings-delete/${recordingId}`);

export const fetchAdminRoomData = (data: object) =>
  api.post('/admin/fetch-room-data', data);

export const markAdminSessionComplete = (data: {session_id: string | number}) =>
  api.post('/admin/mark-session-complete', data);

export const getAdminAllSessions = (params?: {
  skip?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}) => api.get('/admin/all-sessions', {params});

/* ── Reviews ────────────────────────────────────────────────── */
export const getAdminAllReviews = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => api.get('/admin/all-reviews', {params});

export const updateAdminMentorReviewStatus = (data: object) =>
  api.put('/admin/mentor-reviews-status', data);

/* ── Blogs ──────────────────────────────────────────────────── */
export const getAdminBlogs = () =>
  api.get('/admin/blogs');

export const createAdminBlog = (data: object) =>
  api.post('/admin/blogs', data);

export const uploadAdminBlogImage = (file: {
  uri: string;
  name?: string;
  type?: string;
}) => {
  const formData = new FormData();
  formData.append('image', {
    uri: file.uri,
    name: file.name || 'blog_cover.jpg',
    type: file.type || 'image/jpeg',
  } as any);

  return api.post('/admin/blogs/image/upload', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

export const updateAdminBlog = (id: string | number, data: object) =>
  api.put(`/admin/blogs/${id}`, data);

export const deleteAdminBlogImage = (data: object) =>
  api.delete('/admin/blogs/image/delete', {data});
