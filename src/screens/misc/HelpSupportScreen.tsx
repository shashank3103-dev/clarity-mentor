import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {commonService} from '../../services/seekerService';
import {getErrorMessage} from '../../services/api';
import {isEmail} from '../../utils/validation';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';

const topics = [
  {title: 'Booking a session', body: 'Choose a mentor, time, and confirm in just a few taps.', icon: 'mail2' as const},
  {title: 'Your privacy', body: 'Sessions are private and your information stays yours.', icon: 'mail' as const},
  {title: 'Contact support', body: 'Send us a message below and our team will get back to you.', icon: 'phone' as const},
];

export default function HelpSupportScreen({navigation}: any) {
  const {theme} = useTheme();
  const user = useSelector((st: any) => st.auth.user);
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  // Same endpoint as the web contact-us page.
  const send = async () => {
    if (!form.name.trim() || !isEmail(form.email.trim()) || form.message.trim().length < 5) {
      Alert.alert('Check the form', 'Please enter your name, a valid email and a message.');
      return;
    }
    setSending(true);
    try {
      await commonService.contactUs({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setForm({...form, message: ''});
      Alert.alert('Message sent', 'We will contact you soon.');
    } catch (e) {
      Alert.alert('Failed to send', getErrorMessage(e, 'Failed to send message. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Help & Support"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          How can we help?
        </Text>
        <Text style={[styles.intro, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
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
            <View style={[styles.iconBox, {backgroundColor: theme.colors.surfaceMuted}]}>
              <AssetIcon name={topic.icon} size={22} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.head, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
                {topic.title}
              </Text>
              <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                {topic.body}
              </Text>
            </View>
          </View>
        ))}

        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold, fontSize: 20, marginTop: 16}]}>
          Contact us
        </Text>
        <Input label="Name" value={form.name} onChangeText={(v: string) => setForm({...form, name: v})} />
        <Input
          label="Email"
          value={form.email}
          onChangeText={(v: string) => setForm({...form, email: v})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Phone"
          value={form.phone}
          onChangeText={(v: string) => setForm({...form, phone: v.replace(/[^0-9+]/g, '')})}
          keyboardType="phone-pad"
        />
        <Input
          label="Message"
          value={form.message}
          onChangeText={(v: string) => setForm({...form, message: v})}
          multiline
          placeholder="How can we help?"
        />
        <Button title="Send message" onPress={send} loading={sending} />
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
});
