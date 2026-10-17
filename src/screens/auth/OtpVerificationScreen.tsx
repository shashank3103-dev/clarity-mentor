import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../redux/slices/authSlice';
import {verifyRegisterOtp, resendRegisterOtp} from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {tokenStorage} from '../../storage/tokenStorage';

export default function OtpVerificationScreen({route, navigation}: any) {
  const email = route.params?.email || '';
  const role = route.params?.role || 'seeker';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const {theme} = useTheme();

  const handleVerify = async () => {
    if (!otp.trim()) {
      setApiError('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    setApiError(null);
    setInfoMessage(null);

    try {
      const res = await verifyRegisterOtp({
        email,
        otp: otp.trim(),
        role,
      });

      const data = res.data;
      const token = data?.token || data?.data?.token || 'verified-user-token';
      const user = data?.user || data?.data?.user || {email, role};

      await tokenStorage.setToken(token);
      await tokenStorage.setRole(role);
      await tokenStorage.setUser(user);

      dispatch(loginSuccess({token, user}));

      navigation.reset({
        index: 0,
        routes: [{name: 'Main', params: {screen: 'Tabs', params: {screen: 'Home'}}}],
      });
    } catch (err: any) {
      setApiError(
        err?.message ||
        err?.data?.message ||
        'OTP verification failed. Please ensure the code is correct.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setApiError(null);
    setInfoMessage(null);

    try {
      await resendRegisterOtp({email, role});
      setInfoMessage('A new verification code has been sent to your email.');
    } catch (err: any) {
      setApiError(err?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <CustomHeader
        title="Verify Account"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text
          style={[
            styles.title,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          Enter Verification Code
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
          ]}>
          We sent a 6-digit code to{' '}
          <Text style={{fontFamily: theme.fonts.bold, color: theme.colors.text}}>
            {email}
          </Text>
        </Text>

        {apiError ? <ErrorMessage message={apiError} /> : null}
        {infoMessage ? (
          <Text
            style={[
              styles.info,
              {color: theme.colors.secondary, fontFamily: theme.fonts.medium},
            ]}>
            {infoMessage}
          </Text>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Verification Code"
            value={otp}
            onChangeText={(val: string) => {
              setOtp(val);
              if (apiError) setApiError(null);
            }}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="123456"
          />

          <Button
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            disabled={loading}
            style={styles.verifyBtn}
          />

          <Pressable
            onPress={handleResend}
            disabled={resending}
            style={styles.resendWrap}>
            <Text
              style={[
                styles.resendText,
                {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
              ]}>
              Didn't receive the code?{' '}
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.bold,
                }}>
                {resending ? 'Sending...' : 'Resend code'}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  content: {paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40},
  title: {fontSize: 28, letterSpacing: -0.4},
  subtitle: {fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 24},
  info: {textAlign: 'center', marginBottom: 16, fontSize: 13.5},
  form: {marginTop: 4},
  verifyBtn: {marginTop: 18, height: 52},
  resendWrap: {marginTop: 24, alignItems: 'center'},
  resendText: {fontSize: 14},
});
