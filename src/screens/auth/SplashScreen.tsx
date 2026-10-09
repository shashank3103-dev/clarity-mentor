import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../theme/useTheme';
import Logo from '../../components/common/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { isAuthenticated, onboarded } = useSelector((s: any) => s.auth);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(
      () =>
        navigation.replace(
          isAuthenticated ? 'Main' : onboarded ? 'Login' : 'Onboarding',
        ),
      900,
    );
    return () => clearTimeout(t);
  }, [isAuthenticated, onboarded, navigation]);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.primary, paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.logoShell}>
        <Logo width={132} height={65} />
      </View>
      <Text style={[styles.tag, { color: theme.colors.accent, fontFamily: theme.fonts.bold }]}>
        ONE HONEST CONVERSATION. ONE CLEAR NEXT STEP.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShell: {
    width: 176,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 18,
    textAlign: 'center',
  },
});
