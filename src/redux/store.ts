import {configureStore} from '@reduxjs/toolkit'; import auth from './slices/authSlice'; import mentors from './slices/mentorSlice'; import booking from './slices/bookingSlice'; import sessions from './slices/sessionSlice'; import user from './slices/userSlice'; import theme from './slices/themeSlice';
export default configureStore({reducer:{auth,mentors,booking,sessions,user,theme}});
