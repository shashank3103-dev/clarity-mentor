import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import CustomHeader from '../../components/common/CustomHeader';
import CustomCard from '../../components/common/CustomCard';
import CustomSwitch from '../../components/common/CustomSwitch';
import ThemeToggle from '../../components/common/ThemeToggle';
import SectionHeader from '../../components/common/SectionHeader';

export default function SettingsScreen({navigation}: any) {
  const {theme} = useTheme();
  const [reminders, setReminders] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [updates, setUpdates] = useState(false);

  const options = [
    ['Session reminders', 'Never miss an upcoming clarity call', reminders, setReminders],
    ['Mentor recommendations', 'New people whose stories may help', recommendations, setRecommendations],
    ['Product updates', 'Thoughtful updates, never spam', updates, setUpdates],
  ] as const;

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Settings"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView
        style={{backgroundColor: theme.colors.background}}
        contentContainerStyle={styles.wrap}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Preferences
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
          Make Clarity Mentor feel right for you.
        </Text>

        <SectionHeader eyebrow="Appearance" title="Choose your theme" />
        <CustomCard>
          <Text style={[styles.cardTitle, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            Appearance
          </Text>
          <Text style={[styles.copy, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
            Light, dark, or follow your device setting.
          </Text>
          <View style={styles.toggle}>
            <ThemeToggle />
          </View>
        </CustomCard>

        <SectionHeader eyebrow="Notifications" title="Stay in the loop" />
        {options.map(([title, hint, value, setValue]) => (
          <CustomCard key={title} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, {color: theme.colors.text, fontFamily: theme.fonts.semiBold}]}>
                {title}
              </Text>
              <Text style={[styles.rowHint, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                {hint}
              </Text>
            </View>
            <CustomSwitch value={value} onValueChange={setValue} />
          </CustomCard>
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
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 16,
  },
  copy: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  toggle: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
  },
  rowHint: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
});
