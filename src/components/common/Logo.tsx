import React from 'react';
import {Image, StyleProp, ImageStyle} from 'react-native';

type Props = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export default function Logo({width = 106, height = 48, style}: Props) {
  return (
    <Image
      source={require('../../assets/images/clarity-logo.png')}
      style={[{width, height}, style]}
      resizeMode="contain"
      accessibilityLabel="Clarity Mentor Logo"
    />
  );
}
