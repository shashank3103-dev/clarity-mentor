import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import Avatar from '../common/Avatar';

export default function BookingCard({mentor, date, time, duration, price}: any) {
  const {theme} = useTheme();
  const rows = [
    ['Date', date],
    ['Time', time],
    ['Duration', `${duration || 30} minutes`],
    ['Price', `₹${price ?? mentor.price}`],
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={styles.top}>
        <Avatar label={mentor.image} uri={mentor.imageUrl} />
        <View style={styles.headerInfo}>
          <Text style={[styles.name, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            {mentor.name}
          </Text>
          <Text style={[styles.role, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
            {mentor.role}
          </Text>
        </View>
      </View>
      <View style={[styles.line, {backgroundColor: theme.colors.border}]} />
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
            {label}
          </Text>
          <Text style={[styles.value, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
  },
  role: {
    fontSize: 13,
    marginTop: 2,
  },
  line: {
    height: 1,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
});
