import api from './axiosInstance';

/**
 * Mentor APIs.
 *
 * Covers mentor profile, availability settings, media uploads,
 * dashboard, sessions, payouts, and bank accounts.
 */

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface AvailabilitySettingsPayload {
  schedule_type: 'custom' | 'weekly' | string;
  selected_days?: number[];
  slots?: TimeSlot[];
}

export interface MentorExperience {
  id?: string | number;
  company_name: string;
  job_title: string;
  employment_type: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  location: string;
  description: string;
}

export interface MentorProfileUpdatePayload {
  full_name?: string;
  bio?: string;
  about_me?: string;
  hourly_rate?: number;
  expertise_area?: string;
  category_ids?: number[];
  country_code?: string;
  mobile?: string;
  dob?: string;
  city?: string;
  country?: string;
  instagram_url?: string;
  linkedin_url?: string;
  languages?: string; // JSON string or comma-separated
  experiences?: MentorExperience[];
  [key: string]: any;
}

export interface BankDetailsPayload {
  account_number: string;
  ifsc_code: string;
  beneficiary_name: string;
  pan_number: string;
  gst_number?: string;
}

/** Get mentor availability settings by profile slug. */
export const getMentorAvailabilitySettings = (slug: string) =>
  api.get(`/mentor/availability/settings/${slug}`);

/** Update mentor availability settings. */
export const updateMentorAvailabilitySettings = (data: AvailabilitySettingsPayload) =>
  api.post('/mentor/availability/settings', data);

/** Get mentor public profile by slug. */
export const getMentorProfile = (slug: string) =>
  api.get(`/mentor/profile/${slug}`);

/** Update mentor profile. */
export const updateMentorProfile = (data: MentorProfileUpdatePayload) =>
  api.post('/mentor/profile/update', data);

/** Upload mentor profile image (multipart/form-data). */
export const uploadMentorProfileImage = (
  file: {uri: string; name?: string; type?: string},
  fullName?: string,
) => {
  const formData = new FormData();
  formData.append('image', {
    uri: file.uri,
    name: file.name || 'mentor_avatar.jpg',
    type: file.type || 'image/jpeg',
  } as any);

  if (fullName) {
    formData.append('full_name', fullName);
  }

  return api.post('/mentor/profile-image', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

/** Upload mentor intro video (multipart/form-data). */
export const uploadMentorIntroVideo = (file: {
  uri: string;
  name?: string;
  type?: string;
}) => {
  const formData = new FormData();
  formData.append('video', {
    uri: file.uri,
    name: file.name || 'intro_video.mp4',
    type: file.type || 'video/mp4',
  } as any);

  return api.post('/mentor/intro-video', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

/** Get authenticated mentor's own profile info. */
export const getMentorMe = () => api.get('/mentor/me');

/** Get mentor dashboard data (stats, upcoming bookings, earnings). */
export const getMentorDashboard = () => api.get('/mentor/dashboard');

/** Get mentor sessions listing. */
export const getMentorSessions = (params?: {page?: number; limit?: number}) =>
  api.get('/mentor/sessions', {params});

/** Get mentor invoice for a completed booking/order. */
export const getMentorInvoice = (orderId: string) =>
  api.get(`/payment/mentor/invoice/${orderId}`);

/** Connect Razorpay linked account for mentor payouts. */
export const addMentorRazorAccount = (data: object) =>
  api.post('/mentor/add-account', data);

/** Add or update mentor bank account details. */
export const addMentorBankDetails = (data: BankDetailsPayload) =>
  api.post('/mentor/add-bank-details', data);
