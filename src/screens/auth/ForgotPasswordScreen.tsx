import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {colors, spacing} from '../../theme';

type Props = {navigation: {goBack: () => void}};

export default function ForgotPasswordScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{sent ? 'Check your inbox' : 'Reset your password'}</Text>
      <Text style={styles.body}>
        {sent
          ? `We sent a reset link to ${email}.`
          : 'Enter your email and we’ll send a reset link.'}
      </Text>
      {!sent && <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />}
      <Button title={sent ? 'Back to sign in' : 'Send reset link'} onPress={() => (sent ? navigation.goBack() : setSent(true))} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flex: 1, padding: spacing.lg, paddingTop: 90, backgroundColor: colors.background},
  title: {fontSize: 30, fontWeight: '800', color: colors.primary},
  body: {color: colors.textSecondary, marginVertical: 14, lineHeight: 22},
});
