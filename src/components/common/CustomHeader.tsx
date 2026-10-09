import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../theme/useTheme';

export interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  backIcon?: 'arrow' | 'chevron';
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
}

export default function CustomHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  backIcon = 'arrow',
  right,
  style,
  bordered = true,
}: CustomHeaderProps) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handleBack =
    onBack ||
    (showBack && navigation?.canGoBack?.() ? () => navigation.goBack() : undefined);

  const backSource =
    backIcon === 'chevron'
      ? require('../../assets/icons/tabs/chevron-right.png')
      : require('../../assets/icons/tabs/arrow-right.png');

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + (Platform.OS === 'ios' ? 6 : 10),
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: bordered ? 0.5 : 0,
        },
        style,
      ]}>
      {handleBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          style={({pressed}) => [
            styles.backButton,
            {
              backgroundColor: theme.colors.surfaceMuted,
              opacity: pressed ? 0.65 : 1,
            },
          ]}>
          <Image
            source={backSource}
            style={[
              styles.backIcon,
              {
                tintColor: theme.colors.text,
                transform: [{rotate: '180deg'}],
              },
            ]}
            resizeMode="contain"
          />
        </Pressable>
      ) : null}

      <View style={styles.titleWrap}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              fontFamily: theme.fonts.bold,
              color: theme.colors.text,
            },
          ]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                fontFamily: theme.fonts.regular,
                color: theme.colors.mutedText,
              },
            ]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 19,
    height: 19,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
