import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../theme/useTheme';

export interface CheckIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export default function CheckIcon({
  size = 16,
  color,
  strokeWidth = 2.5,
  style,
  accessibilityLabel = 'Check',
}: CheckIconProps) {
  const {theme} = useTheme();
  const iconColor = color ?? theme.colors.accent;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <Path
        d="M20 6L9 17L4 12"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
