import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AssetIcon from '../../components/common/AssetIcon';
import Logo from '../../components/common/Logo';
import { useTheme } from '../../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const d = useDispatch();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    d(loginSuccess(undefined));
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Tabs', params: { screen: 'Home' } } }],
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.wrap, { backgroundColor: theme.colors.background, paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.logoContainer}>
        <Logo width={120} height={58} />
      </View>

      <Text style={[styles.title, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>Welcome back</Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.regular }]}>Sign in to keep moving forward.</Text>

      <View style={styles.formSection}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
        />
        <View style={styles.inputSpacing} />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
      </View>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotWrap}>
        <Text style={[styles.forgot, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>Forgot password?</Text>
      </Pressable>

      <Button title="Sign in" onPress={handleLogin} style={styles.button} />

      <Button
        title="Continue with Google"
        variant="outline"
        leftIcon={<AssetIcon name="google" size={20} accessibilityLabel="Google" />}
        onPress={handleLogin}
        style={styles.google}
      />

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
});
