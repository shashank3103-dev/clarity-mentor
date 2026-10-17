import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, Alert} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';
import {contactUs} from '../../api/authApi';
import {required} from '../../utils/validation';
import {showSuccess} from '../../utils/appFeedback';

const topics = [
  {
    title: 'Booking a session',
    body: 'Choose a mentor, time, and confirm in just a few taps.',
    icon: 'mail2' as const,
  },
  {
    title: 'Your privacy',
    body: 'Sessions are private and your information stays yours.',
    icon: 'mail' as const,
  },
  {
    title: 'Direct email support',
    body: 'support@claritymentor.app',
    icon: 'phone' as const,
  },
];

export default function HelpSupportScreen({navigation}: any) {
  const {theme} = useTheme();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!required(name) || !required(message)) {
      setError('Please provide your name and a brief message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await contactUs({
        name: name.trim(),
        phone: phone.trim() || 'N/A',
        message: message.trim(),
      });
      setSuccess(true);
      showSuccess(
        'Thank you for reaching out! Our team will get back to you shortly.',
        'Message Sent',
      );
      setName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(
        err?.message ||
        err?.data?.message ||
        'Unable to send message. Please email support@claritymentor.app directly.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Help & Support"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView
        contentContainerStyle={styles.wrap}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          How can we help?
        </Text>
        <Text
          style={[
            styles.intro,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          A real person is here when you need a little clarity about using the app.
        </Text>

        {topics.map(topic => (
          <View
            key={topic.title}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <View
              style={[
                styles.iconBox,
                {backgroundColor: theme.colors.surfaceMuted},
              ]}>
              <AssetIcon name={topic.icon} size={22} />
            </View>
            <View style={styles.cardCopy}>
              <Text
                style={[
                  styles.head,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                {topic.title}
              </Text>
              <Text
                style={[
                  styles.body,
                  {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
                ]}>
                {topic.body}
              </Text>
            </View>
          </View>
        ))}

        {/* Contact Us Form */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.formTitle,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            Send us a message
          </Text>

          {error ? <ErrorMessage message={error} /> : null}

          <Input
            label="Your Name"
            value={name}
            onChangeText={(val: string) => {
              setName(val);
              if (error) setError(null);
            }}
            placeholder="John Doe"
          />
          <Input
            label="Phone (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 9876543210"
          />
          <Input
            label="Message"
            value={message}
            onChangeText={(val: string) => {
              setMessage(val);
              if (error) setError(null);
            }}
            multiline
            numberOfLines={4}
            placeholder="Tell us what you need help with..."
          />

          <Button
            title="Send Message"
            loading={loading}
            disabled={loading}
            onPress={handleSubmit}
            style={{marginTop: 8}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    marginBottom: 6,
  },
  intro: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  iconBox: {
    height: 44,
    width: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flex: 1,
  },
  head: {
    fontSize: 15,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 14,
  },
});
