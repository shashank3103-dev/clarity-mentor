import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar, Platform} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';
import {ThemeProvider} from './src/theme/ThemeProvider';
import {useTheme} from './src/theme/useTheme';

function ThemedNavigation() {
  const {theme} = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        const changeNavigationBarColor =
          require('react-native-navigation-bar-color').default;
        changeNavigationBarColor(
          theme.colors.background,
          theme.mode !== 'dark',
          false,
        );
      } catch (_e) {
        // Package may not be linked yet
      }
    }
  }, [theme.mode, theme.colors.background]);

  const navigationTheme = {
    ...(theme.mode === 'dark' ? NavigationDarkTheme : NavigationLightTheme),
    colors: {
      ...(theme.mode === 'dark'
        ? NavigationDarkTheme.colors
        : NavigationLightTheme.colors),
      primary: theme.colors.secondary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.secondary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
