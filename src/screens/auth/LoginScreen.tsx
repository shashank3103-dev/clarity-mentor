import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../redux/slices/authSlice';
import {loginUser} from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import AssetIcon from '../../components/common/AssetIcon';
import Logo from '../../components/common/Logo';
import {useTheme} from '../../theme/useTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isEmail, required} from '../../utils/validation';

export default function LoginScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const validate = (): boolean => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setApiError(null);

    if (!required(email)) {
      setEmailError('Email address is required');
      valid = false;
    } else if (!isEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!required(password)) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const res = await loginUser({
        email: email.trim(),
        password,
      });

      dispatch(loginSuccess(res));
      navigation.reset({
        index: 0,
        routes: [{name: 'Main', params: {screen: 'Tabs', params: {screen: 'Home'}}}],
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.data?.message ||
        'Unable to log in. Please check your credentials and try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    dispatch(
      loginSuccess({
        user: {name: 'Bhanu Pratap', role: 'Software Developer'},
        token: 'dev-guest-token',
      }),
    );
    navigation.reset({
      index: 0,
      routes: [{name: 'Main', params: {screen: 'Tabs', params: {screen: 'Home'}}}],
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrap,
        {backgroundColor: theme.colors.background, paddingTop: insets.top + 16},
      ]}
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

      <Text
        style={[
          styles.title,
          {color: theme.colors.primary, fontFamily: theme.fonts.bold},
        ]}>
        Welcome back
      </Text>
      <Text
        style={[
          styles.body,
          {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
        ]}>
        Sign in to keep moving forward.
      </Text>

      {apiError ? <ErrorMessage message={apiError} /> : null}

      <View style={styles.formSection}>
        <Input
          label="Email"
          value={email}
          onChangeText={(val: string) => {
            setEmail(val);
            if (emailError) setEmailError('');
            if (apiError) setApiError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          error={emailError}
        />
        <View style={styles.inputSpacing} />
        <Input
          label="Password"
          value={password}
          onChangeText={(val: string) => {
            setPassword(val);
            if (passwordError) setPasswordError('');
            if (apiError) setApiError(null);
          }}
          secureTextEntry
          placeholder="••••••••"
          error={passwordError}
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotWrap}>
        <Text
          style={[
            styles.forgot,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          Forgot password?
        </Text>
      </Pressable>

      <Button
        title="Sign in"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      />

      <Button
        title="Continue as Guest"
        variant="outline"
        leftIcon={<AssetIcon name="google" size={20} accessibilityLabel="Google" />}
        onPress={handleGuestLogin}
        style={styles.google}
      />

      <Text
        style={[
          styles.bottom,
          {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
        ]}>
        New to Clarity?{' '}
        <Text
          onPress={() => navigation.navigate('Signup')}
          style={[
            styles.link,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          Create an account
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40},
  logoContainer: {alignItems: 'flex-start', marginBottom: 48},
  title: {fontSize: 32, letterSpacing: -0.4},
  body: {fontSize: 16, lineHeight: 22, marginTop: 10, marginBottom: 32},
  formSection: {marginBottom: 4},
  inputSpacing: {height: 8},
  forgotWrap: {alignSelf: 'flex-end', paddingVertical: 8, marginBottom: 8},
  forgot: {fontSize: 14},
  button: {marginTop: 16, height: 52},
  google: {marginTop: 14, height: 52},
  bottom: {textAlign: 'center', fontSize: 15, marginTop: 28},
  link: {},
});
