import {createSlice} from '@reduxjs/toolkit';
import type {AppMentor, DaySlot} from '../../utils/mentor';

type BookingState = {
  mentor: AppMentor | null;
  conversationId: string | null;
  date: string | null; // YYYY-MM-DD
  slot: DaySlot | null;
  notes: string;
  sessionId: string | number | null;
};

const initialState: BookingState = {
  mentor: null,
  conversationId: null,
  date: null,
  slot: null,
  notes: '',
  sessionId: null,
};

const slice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    startBooking: (s, a) => {
      s.mentor = a.payload.mentor ?? a.payload;
      s.conversationId = a.payload.conversationId ?? null;
      s.date = null;
      s.slot = null;
      s.notes = '';
      s.sessionId = null;
    },
    setDate: (s, a) => {
      s.date = a.payload;
      s.slot = null;
    },
    setSlot: (s, a) => {
      s.slot = a.payload;
    },
    setNotes: (s, a) => {
      s.notes = a.payload;
    },
    bookingConfirmed: (s, a) => {
      s.sessionId = a.payload;
    },
    clearBooking: () => initialState,
  },
});

export const {startBooking, setDate, setSlot, setNotes, bookingConfirmed, clearBooking} =
  slice.actions;
export default slice.reducer;
