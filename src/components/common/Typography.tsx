import React from 'react';
import {Text, TextProps, StyleProp, TextStyle} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'bodyBold'
  | 'caption'
  | 'captionBold'
  | 'eyebrow'
  | 'button'
  | 'label';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export default function Typography({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}: TypographyProps) {
  const {theme} = useTheme();

  const variantStyle = theme.typography[variant] || theme.typography.body;
  const textColor = color || theme.colors.text;

  return (
    <Text
      style={[
        variantStyle,
        {
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
}
