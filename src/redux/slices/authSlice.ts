import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authService, extractRole, extractToken} from '../../services/authService';
import {getErrorMessage} from '../../services/api';
import {storage, UserType} from '../../services/storage';

export type AuthUser = {
  id?: number | string;
  profile_slug?: string;
  full_name: string;
  email: string;
  bio?: string;
  profile_image?: string;
  expertise_area?: string;
  hourly_rate?: string | number;
  categories?: {id: number; name: string}[];
  role?: string;
  status?: string;
  [key: string]: any;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  onboarded: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  userType: null,
  isAuthenticated: false,
  bootstrapped: false,
  onboarded: false,
  loading: false,
  error: null,
};

// Restores a saved session on app start (web: auth-provider initializeUserFromToken).
export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const [token, userType, onboarded] = await Promise.all([
    storage.getToken(),
    storage.getUserType(),
    storage.isOnboarded(),
  ]);
  if (!token || !userType) return {token: null, userType: null, user: null, onboarded};
  try {
    const user = await authService.me(userType);
    return {token, userType, user, onboarded};
  } catch (e: any) {
    if (e?.response?.status === 401) await storage.clearSession();
    // Offline etc: keep the session, profile will load later.
    return e?.response?.status === 401
      ? {token: null, userType: null, user: null, onboarded}
      : {token, userType, user: null, onboarded};
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}: {email: string; password: string}, {rejectWithValue}) => {
    try {
      const response = await authService.login(email, password);
      if (!(response?.status || response?.success)) {
        return rejectWithValue(response?.message || 'Failed to login');
      }
      const token = extractToken(response);
      const userType = extractRole(token, response);
      await storage.setSession(token, userType);
      const user = await authService.me(userType).catch(() => null);
      return {token, userType, user};
    } catch (e) {
      await storage.clearSession();
      return rejectWithValue(getErrorMessage(e, 'Failed to login'));
    }
  },
);

// After signup OTP verification the backend returns a token for the chosen role.
export const verifyRegistration = createAsyncThunk(
  'auth/verifyRegistration',
  async (
    {email, otp, role}: {email: string; otp: string; role: UserType},
    {rejectWithValue},
  ) => {
    try {
      const response = await authService.verifyRegisterOtp(email, otp, role);
      const token = response?.token || response?.data?.token || response?.accessToken;
      if (!token) return rejectWithValue(response?.message || 'Invalid OTP');
      await storage.setSession(token, role);
      const user = await authService.me(role).catch(() => null);
      return {token, userType: role, user};
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, 'Invalid OTP'));
    }
  },
);

export const refreshUser = createAsyncThunk('auth/refreshUser', async (_, {getState}) => {
  const {auth} = getState() as {auth: AuthState};
  if (!auth.userType) return null;
  return authService.me(auth.userType);
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.clearSession();
});

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  await storage.setOnboarded();
});

const signedIn = (s: AuthState, a: PayloadAction<any>) => {
  s.loading = false;
  s.error = null;
  s.token = a.payload.token;
  s.userType = a.payload.userType;
  s.user = a.payload.user;
  s.isAuthenticated = true;
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired: s => {
      s.user = null;
      s.token = null;
      s.userType = null;
      s.isAuthenticated = false;
    },
    clearAuthError: s => {
      s.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuth.fulfilled, (s, a) => {
        s.bootstrapped = true;
        s.onboarded = a.payload.onboarded;
        s.token = a.payload.token;
        s.userType = a.payload.userType;
        s.user = a.payload.user;
        s.isAuthenticated = !!a.payload.token;
      })
      .addCase(bootstrapAuth.rejected, s => {
        s.bootstrapped = true;
      })
      .addCase(login.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, signedIn)
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || 'Failed to login';
      })
      .addCase(verifyRegistration.pending, s => {
        s.loading = true;
        s.error = null;
      })
      .addCase(verifyRegistration.fulfilled, signedIn)
      .addCase(verifyRegistration.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || 'Invalid OTP';
      })
      .addCase(refreshUser.fulfilled, (s, a) => {
        if (a.payload) s.user = a.payload;
      })
      .addCase(logout.fulfilled, s => {
        s.user = null;
        s.token = null;
        s.userType = null;
        s.isAuthenticated = false;
      })
      .addCase(completeOnboarding.fulfilled, s => {
        s.onboarded = true;
      });
  },
});

export const {sessionExpired, clearAuthError} = slice.actions;
export default slice.reducer;
