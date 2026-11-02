import React, {useState} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, Pressable, Alert} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {authService} from '../../services/authService';
import {getErrorMessage} from '../../services/api';
import {isEmail} from '../../utils/validation';

// Two steps like the web: email -> (OTP + new password).
export default function ForgotPasswordScreen({navigation}: any) {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {theme} = useTheme();

  const sendOtp = async () => {
    if (!isEmail(email.trim())) {
      setError('Invalid email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email.trim());
      setStep('reset');
    } catch (e) {
      setError(getErrorMessage(e, 'Failed to send OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    if (otp.length < 6) return setError('OTP must be 6 digits');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError("Passwords don't match");
    setLoading(true);
    setError(null);
    try {
      await authService.setNewPassword(email.trim(), otp, newPassword, confirmPassword);
      Alert.alert('Password updated', 'You can now sign in with your new password.');
      navigation.navigate('Login');
    } catch (e) {
      setError(getErrorMessage(e, 'Failed to reset password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.wrap, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="Reset Password" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, {color: theme.colors.primary, fontFamily: theme.fonts.bold}]}>
          {step === 'email' ? 'Forgot password?' : 'Reset your password'}
        </Text>
        <Text style={[styles.body, {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular}]}>
          {step === 'email'
            ? "Enter your email and we'll send you an OTP to reset your password."
            : `Enter the OTP sent to ${email} and choose a new password.`}
        </Text>

        {step === 'email' ? (
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
          />
        ) : (
          <>
            <Input
              label="OTP"
              value={otp}
              onChangeText={(v: string) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="6-digit code"
            />
            <Input
              label="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="At least 6 characters"
            />
            <Input
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter password"
            />
          </>
        )}

        {error ? (
          <Text style={[styles.error, {color: theme.colors.error, fontFamily: theme.fonts.medium}]}>{error}</Text>
        ) : null}

        <Button
          title={step === 'email' ? 'Send OTP' : 'Reset password'}
          onPress={step === 'email' ? sendOtp : reset}
          loading={loading}
          style={styles.button}
        />
        {step === 'reset' ? (
          <Pressable onPress={sendOtp} disabled={loading} style={styles.resend}>
            <Text style={{color: theme.colors.secondary, fontFamily: theme.fonts.bold, fontSize: 14}}>
              Resend OTP
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flex: 1},
  content: {paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40},
  title: {fontSize: 28, letterSpacing: -0.4},
  body: {fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 28},
  error: {fontSize: 13, textAlign: 'center', marginBottom: 8},
  button: {marginTop: 8, height: 52},
  resend: {alignSelf: 'center', marginTop: 20, padding: 6},
});
