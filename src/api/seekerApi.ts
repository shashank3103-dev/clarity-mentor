import api from './axiosInstance';

/**
 * Seeker APIs.
 *
 * Covers seeker dashboard, profile, sessions, completion, meet links,
 * payment history, and invoices.
 */

export interface SeekerSessionsParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export interface SeekerPaymentHistoryParams {
  search?: string;
  page?: number;
  limit?: number;
}

/** Get seeker's own profile / me details. */
export const getSeekerMe = () => api.get('/seeker/me');

/** Get seeker profile details. */
export const getSeekerProfile = () => api.get('/seeker/profile');

/** Update seeker profile. */
export const updateSeekerProfile = (data: {
  full_name?: string;
  phone?: string;
  bio?: string;
  [key: string]: any;
}) => api.post('/seeker/profile/update', data);

/** Get seeker dashboard data. */
export const getSeekerDashboard = () => api.get('/seeker/dashboard');

/** Upload seeker profile image (multipart/form-data). */
export const uploadSeekerProfileImage = (file: {
  uri: string;
  name?: string;
  type?: string;
}) => {
  const formData = new FormData();
  formData.append('image', {
    uri: file.uri,
    name: file.name || 'profile.jpg',
    type: file.type || 'image/jpeg',
  } as any);

  return api.post('/seeker/profile-image', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

/** Get seeker sessions with optional pagination and date range. */
export const getSeekerSessions = (params?: SeekerSessionsParams) =>
  api.get('/seeker/sessions', {params});

/** Mark session as complete by seeker. */
export const markSessionCompleteBySeeker = (sessionId: string | number) =>
  api.post('/seeker/mark-session-complete', {session_id: String(sessionId)});

/** Get meeting link by meet ID. */
export const getMeetingLink = (meetId: string | number) =>
  api.get('/meet', {params: {meetid: meetId}});

/** Join meeting via email token. */
export const joinMeetingByToken = (token: string) =>
  api.get(`/meet/join/${token}`);

/** Get seeker payment / transaction history. */
export const getSeekerPaymentHistory = (params?: SeekerPaymentHistoryParams) =>
  api.get('/payment/seeker/history', {params});

/** Get seeker invoice by order ID. */
export const getSeekerInvoice = (orderId: string) =>
  api.get(`/payment/seeker/invoice/${orderId}`);
