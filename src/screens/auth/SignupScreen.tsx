import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../redux/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function SignupScreen({navigation}: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const d = useDispatch();
  const {theme} = useTheme();

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <CustomHeader
        title="Create Account"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.wrap, {backgroundColor: theme.colors.background}]}
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

        <View style={styles.formSection}>
          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <View style={styles.inputSpacing} />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.inputSpacing} />
          <Input
            label="Password"
            secureTextEntry
            placeholder="At least 8 characters"
          />
        </View>

        <Button
          title="Create account"
          onPress={() =>
            d(
              loginSuccess({
                name: name || 'Bhanu Pratap',
                role: 'Software Developer',
              }),
            )
          }
          style={styles.button}
        />

        <Text
          onPress={() => navigation.goBack()}
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
  screen: {
    flex: 1,
  },
  wrap: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    letterSpacing: -0.4,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 28,
  },
  formSection: {
    marginBottom: 8,
  },
  inputSpacing: {
    height: 16,
  },
  button: {
    marginTop: 20,
    height: 52,
  },
  back: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 28,
  },
  link: {},
});
