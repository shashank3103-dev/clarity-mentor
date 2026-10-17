import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Booking} from '../../types';

export interface SessionState {
  items: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  items: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (s, a: PayloadAction<Booking[]>) => {
      s.items = a.payload;
      s.loading = false;
      s.error = null;
    },
    setSessionLoading: (s, a: PayloadAction<boolean>) => {
      s.loading = a.payload;
    },
    setSessionError: (s, a: PayloadAction<string | null>) => {
      s.error = a.payload;
      s.loading = false;
    },
    addSession: (s, a: PayloadAction<any>) => {
      s.items.unshift({
        ...a.payload,
        id: a.payload.id || String(Date.now()),
        status: a.payload.status || 'upcoming',
      });
    },
  },
});

export const {setSessions, setSessionLoading, setSessionError, addSession} =
  slice.actions;
export default slice.reducer;
