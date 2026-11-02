import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet, View, Pressable, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {verifyRegistration} from '../../redux/slices/authSlice';
import {authService} from '../../services/authService';
import {getErrorMessage} from '../../services/api';
import {homeRouteFor} from '../../navigation/routes';

export default function VerifyOtpScreen({navigation, route}: any) {
  const {email, role} = route.params || {};
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const dispatch = useDispatch<any>();
  const {loading, error} = useSelector((s: any) => s.auth);
  const {theme} = useTheme();

  const submit = async () => {
    const result = await dispatch(verifyRegistration({email, otp, role}));
    if (verifyRegistration.fulfilled.match(result)) {
      // Web sends new mentors to onboarding; profile editing covers that here.
      navigation.reset({index: 0, routes: [homeRouteFor(role)]});
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await authService.resendRegisterOtp(email, role);
      Alert.alert('OTP sent', `A new code was sent to ${email}.`);
    } catch (e) {
      Alert.alert('Could not resend', getErrorMessage(e, 'Unable to send OTP, please try again later.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Verify Email" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, {color: theme.colors.primary, fontFamily: theme.fonts.bold}]}>
          Enter the code
        </Text>
        <Text style={[styles.body, {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular}]}>
          We sent a 6-digit code to {email}.
        </Text>
        <Input
          label="OTP"
          value={otp}
          onChangeText={(v: string) => setOtp(v.replace(/[^0-9]/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="••••••"
          autoFocus
        />
        {error ? (
          <Text style={[styles.error, {color: theme.colors.error, fontFamily: theme.fonts.medium}]}>{error}</Text>
        ) : null}
        <Button title="Verify" onPress={submit} loading={loading} disabled={otp.length !== 6} style={styles.button} />
        <Pressable onPress={resend} disabled={resending} style={styles.resend}>
          <Text style={{color: theme.colors.secondary, fontFamily: theme.fonts.bold, fontSize: 14}}>
            {resending ? 'Sending…' : 'Resend OTP'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  wrap: {paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40},
  title: {fontSize: 28, letterSpacing: -0.4},
  body: {fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 28},
  error: {fontSize: 13, textAlign: 'center', marginBottom: 8},
  button: {marginTop: 8, height: 52},
  resend: {alignSelf: 'center', marginTop: 20, padding: 6},
});
