import {createSlice, PayloadAction} from '@reduxjs/toolkit';
const themeSlice = createSlice({name: 'theme', initialState: {preference: 'system'}, reducers: {setThemePreference: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => { state.preference = action.payload; }}});
export const {setThemePreference} = themeSlice.actions;
export default themeSlice.reducer;
