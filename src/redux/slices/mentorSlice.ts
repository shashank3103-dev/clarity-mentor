import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {mentors} from '../../data/mentors';
import type {Mentor} from '../../types';

export interface MentorState {
  items: Mentor[];
  selected: Mentor | null;
  loading: boolean;
  error: string | null;
  saved: string[];
}

const initialState: MentorState = {
  items: mentors,
  selected: null,
  loading: false,
  error: null,
  saved: [],
};

const slice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setMentors: (s, a: PayloadAction<Mentor[]>) => {
      s.items = a.payload;
      s.loading = false;
      s.error = null;
    },
    setMentorLoading: (s, a: PayloadAction<boolean>) => {
      s.loading = a.payload;
    },
    setMentorError: (s, a: PayloadAction<string | null>) => {
      s.error = a.payload;
      s.loading = false;
    },
    selectMentor: (s, a: PayloadAction<Mentor | null>) => {
      s.selected = a.payload;
    },
    toggleSaved: (s, a: PayloadAction<string>) => {
      s.saved = s.saved.includes(a.payload)
        ? s.saved.filter(x => x !== a.payload)
        : [...s.saved, a.payload];
    },
  },
});

export const {
  setMentors,
  setMentorLoading,
  setMentorError,
  selectMentor,
  toggleSaved,
} = slice.actions;
export default slice.reducer;
