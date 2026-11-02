import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../redux/slices/authSlice';
import { homeRouteFor } from '../../navigation/routes';
import { isEmail } from '../../utils/validation';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { useTheme } from '../../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation, route }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const d = useDispatch<any>();
  const { loading, error } = useSelector((s: any) => s.auth);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const redirect = route?.params?.redirect;

  const handleLogin = async () => {
    const next: typeof errors = {};
    if (!isEmail(email.trim())) next.email = 'Invalid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    const result = await d(login({ email: email.trim(), password }));
    if (login.fulfilled.match(result)) {
      // Came here from a gated action (e.g. booking) -> go back to it.
      if (redirect && navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.reset({ index: 0, routes: [homeRouteFor(result.payload.userType)] });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.wrap, { backgroundColor: theme.colors.background, paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      <View style={styles.logoContainer}>
        <Logo width={120} height={58} />
      </View>

      <Text style={[styles.title, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>Welcome back</Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.regular }]}>Sign in to keep moving forward.</Text>

      <View style={styles.formSection}>
        <Input
          label="Email"
          value={email}
          onChangeText={(v: string) => {
            setEmail(v);
            if (error) d(clearAuthError());
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />
        <View style={styles.inputSpacing} />
        <Input
          label="Password"
          value={password}
          onChangeText={(v: string) => {
            setPassword(v);
            if (error) d(clearAuthError());
          }}
          error={errors.password}
          secureTextEntry
          placeholder="••••••••"
        />
      </View>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotWrap}>
        <Text style={[styles.forgot, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>Forgot password?</Text>
      </Pressable>

      {error ? (
        <Text style={[styles.error, { color: theme.colors.error, fontFamily: theme.fonts.medium }]}>{error}</Text>
      ) : null}

      <Button title="Sign in" onPress={handleLogin} loading={loading} style={styles.button} />

      <Text style={[styles.bottom, { color: theme.colors.textSecondary, fontFamily: theme.fonts.regular }]}>
        New to Clarity?{' '}
        <Text onPress={() => navigation.navigate('Signup')} style={[styles.link, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>
          Create an account
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoContainer: { alignItems: 'flex-start', marginBottom: 48 },
  title: { fontSize: 32, letterSpacing: -0.4 },
  body: { fontSize: 16, lineHeight: 22, marginTop: 10, marginBottom: 32 },
  formSection: { marginBottom: 4 },
  inputSpacing: { height: 16 },
  forgotWrap: { alignSelf: 'flex-end', paddingVertical: 8, marginBottom: 8 },
  forgot: { fontSize: 14 },
  button: { marginTop: 16, height: 52 },
  google: { marginTop: 14, height: 52 },
  bottom: { textAlign: 'center', fontSize: 15, marginTop: 28 },
  link: {},
  error: { fontSize: 13, textAlign: 'center', marginTop: 4 },
});
