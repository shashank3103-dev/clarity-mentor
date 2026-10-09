import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function ThemeToggle() {
  const {theme, preference, setPreference} = useTheme();
  const choices = ['light', 'dark', 'system'] as const;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 6,
        backgroundColor: theme.colors.surfaceMuted,
        padding: 4,
        borderRadius: 12,
      }}>
      {choices.map(choice => (
        <Pressable
          key={choice}
          onPress={() => setPreference(choice)}
          accessibilityRole="button"
          accessibilityState={{selected: preference === choice}}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 9,
            backgroundColor:
              preference === choice ? theme.colors.surface : 'transparent',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.bold,
              color:
                preference === choice
                  ? theme.colors.text
                  : theme.colors.mutedText,
            }}>
            {choice[0].toUpperCase() + choice.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
