import React from 'react';
import {Image, StyleProp, ViewStyle} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {useTheme} from '../../theme/useTheme';

type IconName =
  | 'hamburger'
  | 'search'
  | 'arrow-right'
  | 'arrow-right-orange'
  | 'arrow-down'
  | 'filter'
  | 'mail'
  | 'mail2'
  | 'star'
  | 'phone'
  | 'google'
  | 'facebook'
  | 'x'
  | 'instagram'
  | 'linkedin'
  | 'ln'
  | 'mouse'
  | 'check'
  | 'chevron-right';

type Props = {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const sources: Record<IconName, number> = {
  hamburger: require('../../assets/icons/hamburger.svg'),
  search: require('../../assets/icons/search.svg'),
  'arrow-right': require('../../assets/icons/arrow-right.svg'),
  'arrow-right-orange': require('../../assets/icons/arrow-right-orange.svg'),
  'arrow-down': require('../../assets/icons/arrow-down.svg'),
  filter: require('../../assets/icons/filter.svg'),
  mail: require('../../assets/icons/mail.svg'),
  mail2: require('../../assets/icons/mail2.svg'),
  star: require('../../assets/icons/Star.svg'),
  phone: require('../../assets/icons/phone.svg'),
  google: require('../../assets/icons/google.svg'),
  facebook: require('../../assets/icons/fb.svg'),
  x: require('../../assets/icons/x.svg'),
  instagram: require('../../assets/icons/insta.svg'),
  linkedin: require('../../assets/icons/linkedin.svg'),
  ln: require('../../assets/icons/ln.svg'),
  mouse: require('../../assets/icons/mouse.svg'),
  check: require('../../assets/icons/check.svg'),
  'chevron-right': require('../../assets/icons/chevron-right.svg'),
};

export default function AssetIcon({
  name,
  size = 'md',
  style,
  accessibilityLabel,
}: Props) {
  const {theme} = useTheme();

  const resolvedSize: number =
    typeof size === 'number'
      ? size
      : theme.iconSizes[size] || theme.iconSizes.md;

  const uri = Image.resolveAssetSource(sources[name]).uri;

  return (
    <SvgUri
      uri={uri}
      width={resolvedSize}
      height={resolvedSize}
      style={style}
      accessibilityLabel={accessibilityLabel || name}
    />
  );
}
