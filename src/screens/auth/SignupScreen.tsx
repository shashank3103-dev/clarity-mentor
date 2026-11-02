import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, StatusBar, Pressable} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {authService} from '../../services/authService';
import {getErrorMessage} from '../../services/api';
import {isEmail} from '../../utils/validation';

const COUNTRY_CODES = ['+91', '+1', '+44', '+61', '+971', '+65'];
type Role = 'seeker' | 'mentor';

export default function SignupScreen({navigation, route}: any) {
  const [role, setRole] = useState<Role>(route?.params?.role || 'seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {theme} = useTheme();

  const submit = async () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!isEmail(email.trim())) next.email = 'Invalid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (mobile && !/^[0-9]{6,15}$/.test(mobile)) next.mobile = 'Mobile number must be 6 to 15 digits';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setError(null);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      mobile: mobile || undefined,
      country_code: countryCode,
    };
    try {
      const res = await authService.register(payload);
      if (res?.status === false) {
        setError(res?.message || 'An error occurred during registration');
        return;
      }
      navigation.navigate('VerifyOtp', {email: payload.email, role});
    } catch (e) {
      setError(getErrorMessage(e, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <CustomHeader title="Create Account" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.wrap, {backgroundColor: theme.colors.background}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Logo width={110} height={52} />
        </View>

        <Text style={[styles.title, {color: theme.colors.primary, fontFamily: theme.fonts.bold}]}>
          Create your account
        </Text>
        <Text style={[styles.body, {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular}]}>
          {role === 'mentor'
            ? 'Help others take the right decision.'
            : 'A little clarity can change everything.'}
        </Text>

        <View style={[styles.roles, {backgroundColor: theme.colors.surfaceMuted}]}>
          {(['seeker', 'mentor'] as Role[]).map(r => {
            const active = role === r;
            return (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                accessibilityRole="button"
                accessibilityState={{selected: active}}
                style={[styles.roleTab, active && {backgroundColor: theme.colors.surface, elevation: 2}]}>
                <Text
                  style={{
                    fontSize: 14,
                    color: active ? theme.colors.text : theme.colors.mutedText,
                    fontFamily: active ? theme.fonts.bold : theme.fonts.medium,
                  }}>
                  Join as {r === 'seeker' ? 'Seeker' : 'Mentor'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" error={errors.name} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Text style={[styles.label, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Mobile <Text style={{fontFamily: theme.fonts.regular, color: theme.colors.mutedText}}>(optional)</Text>
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codes}>
          {COUNTRY_CODES.map(code => (
            <Pressable
              key={code}
              onPress={() => setCountryCode(code)}
              style={[
                styles.code,
                {
                  borderColor: countryCode === code ? theme.colors.primary : theme.colors.border,
                  backgroundColor: countryCode === code ? theme.colors.primary : theme.colors.surface,
                },
              ]}>
              <Text
                style={{
                  fontSize: 12.5,
                  fontFamily: theme.fonts.semiBold,
                  color: countryCode === code ? theme.colors.onPrimary : theme.colors.text,
                }}>
                {code}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Input
          value={mobile}
          onChangeText={(v: string) => setMobile(v.replace(/[^0-9]/g, ''))}
          placeholder="Your mobile number"
          keyboardType="number-pad"
          maxLength={15}
          error={errors.mobile}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="At least 6 characters"
          error={errors.password}
        />

        {error ? (
          <Text style={[styles.error, {color: theme.colors.error, fontFamily: theme.fonts.medium}]}>{error}</Text>
        ) : null}

        <Button title="Create account" onPress={submit} loading={loading} style={styles.button} />

        <Text
          onPress={() => navigation.navigate('Login')}
          style={[styles.back, {color: theme.colors.textSecondary, fontFamily: theme.fonts.semiBold}]}>
          Already have an account?{' '}
          <Text style={{color: theme.colors.primary, fontFamily: theme.fonts.bold}}>Sign in</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  wrap: {flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40},
  logoContainer: {alignItems: 'flex-start', marginBottom: 20},
  title: {fontSize: 28, letterSpacing: -0.4},
  body: {fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 20},
  roles: {flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 20},
  roleTab: {flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 10},
  label: {fontSize: 13, marginBottom: 7},
  codes: {flexGrow: 0, marginBottom: 8},
  code: {borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8},
  error: {fontSize: 13, textAlign: 'center', marginTop: 4},
  button: {marginTop: 16, height: 52},
  back: {textAlign: 'center', fontSize: 15, marginTop: 28},
});
