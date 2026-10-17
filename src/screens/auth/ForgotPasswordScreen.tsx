import React, {useState} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, Alert} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {forgotPassword, setNewPassword} from '../../api/authApi';
import {isEmail, required} from '../../utils/validation';

type Props = {navigation: {goBack: () => void; navigate: (screen: string) => void}};

export default function ForgotPasswordScreen({navigation}: Props) {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setPasswordVal] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {theme} = useTheme();

  const handleRequestOtp = async () => {
    setEmailError('');
    setApiError(null);

    if (!required(email)) {
      setEmailError('Email address is required');
      return;
    }
    if (!isEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({email: email.trim()});
      setStep('reset');
      setSuccessMessage('We sent a verification code to your email.');
    } catch (err: any) {
      setApiError(
        err?.message ||
        err?.data?.message ||
        'Unable to send reset code. Please check your email.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setOtpError('');
    setPasswordError('');
    setConfirmError('');
    setApiError(null);

    let valid = true;
    if (!required(otp)) {
      setOtpError('Verification code is required');
      valid = false;
    }
    if (!required(newPassword) || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      await setNewPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      Alert.alert(
        'Password Reset Successful',
        'Your password has been changed. You can now sign in with your new password.',
        [{text: 'Sign In', onPress: () => navigation.navigate('Login')}],
      );
    } catch (err: any) {
      setApiError(
        err?.message ||
        err?.data?.message ||
        'Failed to reset password. Please verify the code and try again.',
      );
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

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text
          style={[
            styles.title,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          {step === 'request' ? 'Reset your password' : 'Create new password'}
        </Text>
        <Text
          style={[
            styles.body,
            {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
          ]}>
          {step === 'request'
            ? "Enter your account email and we'll send a 6-digit verification code."
            : `Enter the code sent to ${email} along with your new password.`}
        </Text>

        {apiError ? <ErrorMessage message={apiError} /> : null}
        {successMessage ? (
          <Text
            style={[
              styles.success,
              {color: theme.colors.secondary, fontFamily: theme.fonts.medium},
            ]}>
            {successMessage}
          </Text>
        ) : null}

        {step === 'request' ? (
          <View>
            <Input
              label="Email"
              value={email}
              onChangeText={(val: string) => {
                setEmail(val);
                if (emailError) setEmailError('');
                if (apiError) setApiError(null);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Button
              title="Send reset code"
              onPress={handleRequestOtp}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />
          </View>
        ) : (
          <View>
            <Input
              label="Verification Code (OTP)"
              value={otp}
              onChangeText={(val: string) => {
                setOtp(val);
                if (otpError) setOtpError('');
                if (apiError) setApiError(null);
              }}
              keyboardType="number-pad"
              placeholder="123456"
              error={otpError}
            />

            <Input
              label="New Password"
              value={newPassword}
              onChangeText={(val: string) => {
                setPasswordVal(val);
                if (passwordError) setPasswordError('');
                if (apiError) setApiError(null);
              }}
              secureTextEntry
              placeholder="At least 6 characters"
              error={passwordError}
            />

            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(val: string) => {
                setConfirmPassword(val);
                if (confirmError) setConfirmError('');
                if (apiError) setApiError(null);
              }}
              secureTextEntry
              placeholder="Repeat your new password"
              error={confirmError}
            />

            <Button
              title="Set new password"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flex: 1},
  content: {paddingHorizontal: 24, paddingVertical: 16},
  title: {fontSize: 30},
  body: {marginVertical: 14, lineHeight: 22, fontSize: 16},
  success: {textAlign: 'center', marginBottom: 16, fontSize: 13.5},
  button: {marginTop: 16},
});
