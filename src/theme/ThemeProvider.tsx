import React, {createContext, useEffect, useMemo, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setThemePreference} from '../redux/slices/themeSlice';
import {darkTheme} from './darkTheme';
import {lightTheme} from './lightTheme';

type Preference = 'light' | 'dark' | 'system';
export const ThemeContext = createContext<any>(null);
const KEY = 'clarity-theme-preference';

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const preference = useSelector((state: any) => state.theme.preference) as Preference;
  const dispatch = useDispatch();
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const updatePreference = (next: Preference) => { dispatch(setThemePreference(next)); AsyncStorage.setItem(KEY, next); };
  useEffect(() => { AsyncStorage.getItem(KEY).then(value => { if (value === 'light' || value === 'dark' || value === 'system') dispatch(setThemePreference(value)); }); }, [dispatch]);
  useEffect(() => { const subscription = Appearance.addChangeListener(({colorScheme}) => setSystemScheme(colorScheme)); return () => subscription.remove(); }, []);
  const mode = preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const value = useMemo(() => ({theme, preference, setPreference: updatePreference, toggleTheme: () => updatePreference(mode === 'dark' ? 'light' : 'dark')}), [theme, preference, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
