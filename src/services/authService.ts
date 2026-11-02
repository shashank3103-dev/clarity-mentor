import api from './api';
import type {UserType} from './storage';

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserType;
  mobile?: string;
  country_code?: string;
};

// Minimal JWT payload decode (no signature check) to read the role, as the web does with jwt-decode.
const decodeJwt = (token: string): any => {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = part + '='.repeat((4 - (part.length % 4)) % 4);
    const json = decodeURIComponent(
      global
        .atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const extractToken = (response: any): string => {
  const token =
    response?.token || response?.accessToken || response?.jwt || response?.data?.token;
  if (!token) throw new Error('No token received from server');
  return token;
};

export const extractRole = (token: string, response: any): UserType =>
  (decodeJwt(token)?.role || response?.role || response?.data?.role) as UserType;

export const authService = {
  // Single login endpoint for both roles; role comes back inside the JWT.
  async login(email: string, password: string) {
    const res = await api.post('/user/login', {email, password});
    return res.data;
  },
  async register({mobile, country_code, ...rest}: RegisterPayload) {
    const res = await api.post('/user/register', {
      ...rest,
      ...(mobile ? {mobile, country_code: country_code || '+91'} : {}),
      utm_source: 'mobile_app',
    });
    return res.data;
  },
  async verifyRegisterOtp(email: string, otp: string, role: UserType) {
    const res = await api.post('/user/verify-register-otp', {email, otp, role});
    return res.data;
  },
  async resendRegisterOtp(email: string, role: UserType) {
    const res = await api.post('/user/resend-register-otp', {email, role});
    return res.data;
  },
  async forgotPassword(email: string) {
    const res = await api.post('/user/forgot-password', {email});
    return res.data;
  },
  async setNewPassword(email: string, otp: string, new_password: string, confirm_password: string) {
    const res = await api.post('/user/set-new-password', {
      email,
      otp,
      new_password,
      confirm_password,
    });
    return res.data;
  },
  async me(userType: UserType) {
    const res = await api.get(userType === 'seeker' ? '/seeker/me' : '/mentor/me');
    return res.data?.data || null;
  },
};

// Kept for older imports.
export const loginUser = authService.login;
export const registerUser = authService.register;
