import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, StatusBar, Pressable} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../redux/slices/authSlice';
import {userRegister} from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Logo from '../../components/common/Logo';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {isEmail, required} from '../../utils/validation';

export default function SignupScreen({navigation}: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'seeker' | 'mentor'>('seeker');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const {theme} = useTheme();

  const validate = (): boolean => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setApiError(null);

    if (!required(name)) {
      setNameError('Full name is required');
      valid = false;
    }

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

  const handleSignup = async () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      await userRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      // User registered! Navigate to OTP verification
      navigation.navigate('OtpVerification', {
        email: email.trim(),
        role,
      });
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.data?.message ||
        'Registration failed. Please verify your details and try again.';
      setApiError(msg);
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
      <CustomHeader
        title="Create Account"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.wrap,
          {backgroundColor: theme.colors.background},
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Logo width={110} height={52} />
        </View>

        <Text
          style={[
            styles.title,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          Create your account
        </Text>
        <Text
          style={[
            styles.body,
            {color: theme.colors.textSecondary, fontFamily: theme.fonts.regular},
          ]}>
          A little clarity can change everything.
        </Text>

        {apiError ? <ErrorMessage message={apiError} /> : null}

        {/* Role toggle */}
        <View style={styles.roleContainer}>
          <Pressable
            onPress={() => setRole('seeker')}
            style={[
              styles.roleTab,
              {
                backgroundColor:
                  role === 'seeker'
                    ? theme.colors.primary
                    : theme.colors.surfaceMuted,
              },
            ]}>
            <Text
              style={[
                styles.roleText,
                {
                  color:
                    role === 'seeker'
                      ? theme.colors.onPrimary
                      : theme.colors.text,
                  fontFamily:
                    role === 'seeker' ? theme.fonts.bold : theme.fonts.medium,
                },
              ]}>
              I'm looking for advice (Seeker)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole('mentor')}
            style={[
              styles.roleTab,
              {
                backgroundColor:
                  role === 'mentor'
                    ? theme.colors.primary
                    : theme.colors.surfaceMuted,
              },
            ]}>
            <Text
              style={[
                styles.roleText,
                {
                  color:
                    role === 'mentor'
                      ? theme.colors.onPrimary
                      : theme.colors.text,
                  fontFamily:
                    role === 'mentor' ? theme.fonts.bold : theme.fonts.medium,
                },
              ]}>
              I want to mentor others
            </Text>
          </Pressable>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Full name"
            value={name}
            onChangeText={(val: string) => {
              setName(val);
              if (nameError) setNameError('');
              if (apiError) setApiError(null);
            }}
            placeholder="Your name"
            error={nameError}
          />
          <View style={styles.inputSpacing} />
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
            placeholder="At least 6 characters"
            error={passwordError}
          />
        </View>

        <Button
          title="Create account"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />

        <Text
          onPress={() => navigation.navigate('Login')}
          style={[
            styles.back,
            {color: theme.colors.textSecondary, fontFamily: theme.fonts.semiBold},
          ]}>
          Already have an account?{' '}
          <Text
            style={[
              styles.link,
              {color: theme.colors.primary, fontFamily: theme.fonts.bold},
            ]}>
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1},
  wrap: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  logoContainer: {alignItems: 'flex-start', marginBottom: 20},
  title: {fontSize: 28, letterSpacing: -0.4},
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },
  roleContainer: {
    gap: 8,
    marginBottom: 20,
  },
  roleTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 13,
  },
  formSection: {marginBottom: 8},
  inputSpacing: {height: 8},
  button: {marginTop: 20, height: 52},
  back: {textAlign: 'center', fontSize: 15, marginTop: 28},
  link: {},
});
