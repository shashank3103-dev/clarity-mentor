import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import {config} from '../config';
import {tokenStorage} from '../storage/tokenStorage';

/* ------------------------------------------------------------------ */
/*  Axios instance                                                     */
/* ------------------------------------------------------------------ */

const api: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.requestTimeout,
  headers: {'Content-Type': 'application/json'},
});

/* ------------------------------------------------------------------ */
/*  Request interceptor – attach Bearer token automatically            */
/* ------------------------------------------------------------------ */

api.interceptors.request.use(
  async (cfg: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getToken();
    if (token && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ------------------------------------------------------------------ */
/*  Response interceptor – normalise error shapes                      */
/* ------------------------------------------------------------------ */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

api.interceptors.response.use(
  response => response,
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      message: 'Something went wrong. Please try again.',
    };

    if (error.response) {
      const {status, data} = error.response;
      apiError.status = status;
      apiError.message =
        data?.message || data?.error || `Request failed (${status})`;
      apiError.data = data;

      if (status === 401) {
        apiError.message = 'Session expired. Please sign in again.';
        apiError.code = 'UNAUTHORIZED';
        // Token cleanup is handled by the auth slice / consumer.
      } else if (status === 403) {
        apiError.message = 'You don\'t have permission for this action.';
        apiError.code = 'FORBIDDEN';
      } else if (status === 422) {
        apiError.message = data?.message || 'Validation failed.';
        apiError.code = 'VALIDATION';
      } else if (status >= 500) {
        apiError.message = 'Server error. Please try again later.';
        apiError.code = 'SERVER_ERROR';
      }
    } else if (error.code === 'ECONNABORTED') {
      apiError.message = 'Request timed out. Check your connection.';
      apiError.code = 'TIMEOUT';
    } else if (!error.response) {
      apiError.message =
        'No internet connection. Please check your network.';
      apiError.code = 'NETWORK_ERROR';
    }

    return Promise.reject(apiError);
  },
);

export default api;
