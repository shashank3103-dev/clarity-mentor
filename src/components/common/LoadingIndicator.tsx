import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function LoadingIndicator({fullScreen = true}: {fullScreen?: boolean}) {
  const {theme} = useTheme();
  return <View accessibilityLabel="Loading" style={{flex: fullScreen ? 1 : 0, minHeight: fullScreen ? undefined : 52, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator color={theme.colors.secondary} /></View>;
}
