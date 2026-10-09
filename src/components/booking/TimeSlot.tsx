import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function TimeSlot({time, selected, onPress}: any) {
  const {theme} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.slot,
        {
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: selected ? theme.colors.onPrimary : theme.colors.text,
            fontFamily: selected ? theme.fonts.bold : theme.fonts.medium,
          },
        ]}>
        {time}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '31%',
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  text: {
    fontSize: 13,
  },
});
