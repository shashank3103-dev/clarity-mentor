import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {UserProfile} from '../../types';

export interface UserState {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: {
    name: 'Bhanu Pratap',
    role: 'Software Developer',
    email: 'bhanu@example.com',
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (s, a: PayloadAction<UserProfile>) => {
      s.profile = a.payload;
    },
    updateProfile: (s, a: PayloadAction<Partial<UserProfile>>) => {
      s.profile = {...s.profile, ...a.payload};
    },
  },
});

export const {setProfile, updateProfile} = slice.actions;
export default slice.reducer;
