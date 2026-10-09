import React from 'react';
import {Pressable, Text, View, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function SectionHeader({
  eyebrow,
  title,
  action,
  onAction,
  style,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        {
          marginTop: 24,
          marginBottom: 12,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        },
        style,
      ]}>
      <View style={{flex: 1}}>
        {eyebrow && (
          <Text
            style={{
              fontSize: 10,
              fontFamily: theme.fonts.bold,
              letterSpacing: 1.1,
              color: theme.colors.secondary,
              marginBottom: 4,
            }}>
            {eyebrow.toUpperCase()}
          </Text>
        )}
        <Text
          style={{
            fontSize: 18,
            lineHeight: 24,
            fontFamily: theme.fonts.bold,
            color: theme.colors.text,
            letterSpacing: -0.2,
          }}>
          {title}
        </Text>
      </View>
      {action && (
        <Pressable
          onPress={onAction}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityRole="button">
          <Text
            style={{
              fontSize: 12.5,
              fontFamily: theme.fonts.bold,
              color: theme.colors.secondary,
              marginBottom: 2,
            }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
