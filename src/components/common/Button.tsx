import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  View,
  DimensionValue
} from 'react-native';
import {useTheme} from '../../theme/useTheme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'soft' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
  height?: number;
  width?: DimensionValue;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  height,
  width
}: ButtonProps) {
  const {theme} = useTheme();
  
  const solid = variant === 'primary' || variant === 'secondary';
  
  let background = 'transparent';
  if (variant === 'primary') background = theme.colors.primary;
  else if (variant === 'secondary') background = theme.colors.secondary;
  else if (variant === 'soft') background = theme.colors.surfaceMuted;

  return (
    <Pressable
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{disabled, busy: loading}}
      accessibilityLabel={accessibilityLabel || title}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          minHeight: height || 52,
          width,
          backgroundColor: background,
          borderColor: theme.colors.primary,
          borderRadius: theme.radius.md,
        },
        variant === 'outline' && styles.outline,
        (pressed || disabled) && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={solid ? theme.colors.onPrimary : theme.colors.text} />
      ) : (
        <View style={styles.inner}>
          {leftIcon}
          <Text
            style={[
              styles.text,
              {
                color: solid ? theme.colors.onPrimary : theme.colors.text,
                fontFamily: theme.fonts.bold,
              },
              variant === 'text' && {color: theme.colors.secondary},
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  outline: {
    borderWidth: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.68,
  },
});
