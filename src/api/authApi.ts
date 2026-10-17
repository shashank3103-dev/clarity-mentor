import api from './axiosInstance';

/**
 * Authentication APIs.
 *
 * Covers both the unified /user/* endpoints and the legacy
 * /seeker/* endpoints visible in the Postman collection.
 */

// ────────────────────────────────────────────────────────
//  Unified User-Auth  (POST /user/…)
// ────────────────────────────────────────────────────────

/** Register a new user (seeker or mentor). */
export const userRegister = (data: {
  name: string;
  email: string;
  password: string;
  role: 'seeker' | 'mentor';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  first_touch_json?: object;
  last_touch_json?: object;
}) => api.post('/user/register', data);

/** Log in an existing user. */
export const userLogin = (data: {email: string; password: string}) =>
  api.post('/user/login', data);

/** Verify the OTP sent after registration. */
export const verifyRegisterOtp = (data: {
  email: string;
  otp: string;
  role: 'seeker' | 'mentor';
}) => api.post('/user/verify-register-otp', data);

/** Resend the registration OTP. */
export const resendRegisterOtp = (data: {
  email: string;
  role: 'seeker' | 'mentor';
}) => api.post('/user/resend-register-otp', data);

/** Request a password-reset OTP. */
export const forgotPassword = (data: {email: string}) =>
  api.post('/user/forgot-password', data);

/** Set a new password using the OTP. */
export const setNewPassword = (data: {
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}) => api.post('/user/set-new-password', data);

/** Submit a contact-us request. */
export const contactUs = (data: {
  name: string;
  phone: string;
  message: string;
}) => api.post('/user/contact-us', data);

/** Fetch all mentor profile slugs (public, for sitemap). */
export const getMentorProfileSlugs = () =>
  api.get('/user/mentor-profile-slugs');

// ────────────────────────────────────────────────────────
//  Legacy Seeker Auth  (POST /seeker/…)
// ────────────────────────────────────────────────────────

/** Legacy seeker login. */
export const seekerLogin = (data: {email: string; password: string}) =>
  api.post('/seeker/login', data);

/** Legacy seeker registration. */
export const seekerRegister = (data: {
  full_name: string;
  email: string;
  password: string;
}) => api.post('/seeker/register', data);

/** Legacy seeker OTP verification. */
export const seekerVerifyOtp = (data: {email: string; otp: string}) =>
  api.post('/seeker/verify-otp', data);

/** Legacy seeker password reset. */
export const seekerSetNewPassword = (data: {
  otp: string;
  email: string;
  new_password: string;
  confirm_password: string;
}) => api.post('/seeker/set-new-password', data);
