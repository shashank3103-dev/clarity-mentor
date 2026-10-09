import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function DateSelector({date, selected, onPress}: any) {
  const {theme} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.item,
        {
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
        },
      ]}>
      <Text
        style={[
          styles.day,
          {
            color: selected ? theme.colors.onPrimary : theme.colors.mutedText,
            fontFamily: theme.fonts.medium,
          },
        ]}>
        {date.day}
      </Text>
      <Text
        style={[
          styles.num,
          {
            color: selected ? theme.colors.onPrimary : theme.colors.text,
            fontFamily: theme.fonts.bold,
          },
        ]}>
        {date.num}
      </Text>
      <Text
        style={[
          styles.month,
          {
            color: selected ? theme.colors.onPrimary : theme.colors.mutedText,
            fontFamily: theme.fonts.regular,
          },
        ]}>
        {date.month}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 68,
    minHeight: 88,
    marginRight: 10,
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  day: {
    fontSize: 12,
  },
  num: {
    fontSize: 20,
    marginVertical: 2,
  },
  month: {
    fontSize: 12,
  },
});
