import axios, {AxiosError} from 'axios';
import {BASE_URL} from '../config/env';
import {storage} from './storage';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async config => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Called when the backend rejects our token; wired up by the store.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: any, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export default api;
