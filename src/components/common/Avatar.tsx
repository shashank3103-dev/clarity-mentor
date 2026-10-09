import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

/** Map mentor initials to real profile image URLs (UI Faces / randomuser-style) */
const mentorImages: Record<string, string> = {
  AV: 'https://randomuser.me/api/portraits/women/44.jpg',
  RS: 'https://randomuser.me/api/portraits/men/32.jpg',
  MI: 'https://randomuser.me/api/portraits/women/65.jpg',
  KS: 'https://randomuser.me/api/portraits/men/75.jpg',
  NK: 'https://randomuser.me/api/portraits/women/68.jpg',
  VR: 'https://randomuser.me/api/portraits/men/45.jpg',
  AB: 'https://randomuser.me/api/portraits/women/52.jpg',
  AM: 'https://randomuser.me/api/portraits/men/64.jpg',
};

type Props = {
  label?: string;
  size?: number;
  uri?: string;
};

export default function Avatar({label = 'CM', size = 48, uri}: Props) {
  const {theme} = useTheme();
  const imageUrl = uri || mentorImages[label];
  const borderRadius = size / 2;

  if (imageUrl) {
    return (
      <Image
        source={{uri: imageUrl}}
        accessibilityLabel={`${label} avatar`}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius,
            backgroundColor: theme.colors.surfaceMuted,
          },
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`${label} avatar`}
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: theme.colors.surfaceMuted,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 0.29,
            color: theme.colors.text,
            fontFamily: theme.fonts.bold,
          },
        ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {},
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {},
});
