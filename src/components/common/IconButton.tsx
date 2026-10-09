import React from 'react';
import {Pressable, ViewStyle, Image} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function IconButton({
  icon = 'arrow',
  onPress,
  label,
  style,
}: {
  icon?: 'arrow' | 'chevron' | 'check' | string;
  onPress: () => void;
  label: string;
  style?: ViewStyle;
}) {
  const {theme} = useTheme();

  const isCheck = icon === 'check';
  const source = isCheck
    ? require('../../assets/icons/tabs/check.png')
    : icon === 'chevron'
    ? require('../../assets/icons/tabs/chevron-right.png')
    : require('../../assets/icons/tabs/arrow-right.png');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      style={({pressed}) => [
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceMuted,
          opacity: pressed ? 0.65 : 1,
        },
        style,
      ]}>
      <Image
        source={source}
        style={{
          width: 19,
          height: 19,
          tintColor: theme.colors.text,
          ...(isCheck ? {} : {transform: [{rotate: '180deg'}]}),
        }}
        resizeMode="contain"
      />
    </Pressable>
  );
}
