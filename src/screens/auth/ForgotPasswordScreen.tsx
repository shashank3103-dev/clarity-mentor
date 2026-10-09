import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import { useTheme } from '../../theme/useTheme';

type Props = { navigation: { goBack: () => void } };

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <CustomHeader title="Reset Password" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary, fontFamily: theme.fonts.bold }]}>
          {sent ? 'Check your inbox' : 'Reset your password'}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.regular }]}>
          {sent
            ? `We sent a reset link to ${email}.`
            : 'Enter your email and we\'ll send a reset link.'}
        </Text>
        
        {!sent && (
          <Input 
            label="Email" 
            value={email} 
            onChangeText={setEmail} 
            placeholder="you@example.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
          />
        )}
        
        <Button 
          title={sent ? 'Back to sign in' : 'Send reset link'} 
          onPress={() => (sent ? navigation.goBack() : setSent(true))} 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  content: { paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontSize: 30 },
  body: { marginVertical: 14, lineHeight: 22, fontSize: 16 },
  button: { marginTop: 16 }
});
