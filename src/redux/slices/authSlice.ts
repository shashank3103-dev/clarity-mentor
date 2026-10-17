import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {tokenStorage} from '../../storage/tokenStorage';

export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  onboarded: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  onboarded: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    completeOnboarding: s => {
      s.onboarded = true;
    },
    setLoading: (s, a: PayloadAction<boolean>) => {
      s.loading = a.payload;
    },
    setError: (s, a: PayloadAction<string | null>) => {
      s.error = a.payload;
      s.loading = false;
    },
    loginSuccess: (s, a: PayloadAction<any>) => {
      const payload = a.payload;
      const user = payload?.user || (payload?.email ? payload : {
        name: 'Bhanu Pratap',
        role: 'Software Developer',
      });
      const token = payload?.token || 'mock-token';

      s.user = user;
      s.token = token;
      s.isAuthenticated = true;
      s.loading = false;
      s.error = null;
    },
    logout: s => {
      s.user = null;
      s.token = null;
      s.isAuthenticated = false;
      s.loading = false;
      s.error = null;
      tokenStorage.clearAll().catch(() => {});
    },
  },
});

export const {completeOnboarding, setLoading, setError, loginSuccess, logout} =
  slice.actions;
export default slice.reducer;
