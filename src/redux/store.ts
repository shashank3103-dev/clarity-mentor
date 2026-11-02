import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import auth, {sessionExpired} from './slices/authSlice';
import mentors from './slices/mentorSlice';
import booking from './slices/bookingSlice';
import theme from './slices/themeSlice';
import {setUnauthorizedHandler} from '../services/api';
import {storage} from '../services/storage';

const store = configureStore({reducer: {auth, mentors, booking, theme}});

setUnauthorizedHandler(() => {
  if (store.getState().auth.isAuthenticated) {
    storage.clearSession();
    store.dispatch(sessionExpired());
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
