import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';

const topics = [
  {title: 'Booking a session', body: 'Choose a mentor, time, and confirm in just a few taps.', icon: 'mail2' as const},
  {title: 'Your privacy', body: 'Sessions are private and your information stays yours.', icon: 'mail' as const},
  {title: 'Contact support', body: 'support@claritymentor.app', icon: 'phone' as const},
];

export default function HelpSupportScreen({navigation}: any) {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Help & Support"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
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
