import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { bootstrapAuth } from '../../redux/slices/authSlice';
import { homeRouteFor } from '../../navigation/routes';
import { useTheme } from '../../theme/useTheme';
import Logo from '../../components/common/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen({ navigation }: any) {
  const { theme } = useTheme();
  const dispatch = useDispatch<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise(resolve => setTimeout(resolve, 900));
    Promise.all([dispatch(bootstrapAuth()).unwrap(), minDelay])
      .then(([session]: any) => {
        if (cancelled) return;
        if (session?.token) {
          navigation.reset({ index: 0, routes: [homeRouteFor(session.userType)] });
        } else {
          navigation.replace(session?.onboarded ? 'Login' : 'Onboarding');
        }
      })
      .catch(() => !cancelled && navigation.replace('Login'));
    return () => {
      cancelled = true;
    };
  }, [dispatch, navigation]);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.primary, paddingTop: insets.top }]}>
      <StatusBar translucent={false} backgroundColor={theme.colors.primary} barStyle="light-content" />
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
