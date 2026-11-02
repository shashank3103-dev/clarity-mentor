/**
 * Application configuration.
 *
 * The base URL should be set via the `API_BASE_URL` environment variable.
 * If not provided, a placeholder is used so the app compiles without
 * react-native-config wired in. You MUST update this value before testing
 * against a real backend.
 *
 * TODO: Replace the placeholder with your actual backend URL, e.g.
 *   "https://api.claritymentor.com/v1/api"
 */

const API_BASE_URL = 'https://api.claritymentor.com/v1/api';

export const config = {
  /** Root URL for all API calls (no trailing slash). */
  apiBaseUrl: API_BASE_URL,

  /** Default request timeout in milliseconds. */
  requestTimeout: 15_000,

  /** Secure-storage keys. */
  storageKeys: {
    accessToken: 'clarity_access_token',
    userRole: 'clarity_user_role',
    userData: 'clarity_user_data',
  },
} as const;
