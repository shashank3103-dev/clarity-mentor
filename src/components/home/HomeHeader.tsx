import React from 'react';
import {View, StyleSheet, Pressable, Platform, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Logo from '../common/Logo';
import AssetIcon from '../common/AssetIcon';
import {useTheme} from '../../theme/useTheme';

export interface HomeHeaderProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
}

export default function HomeHeader({
  onMenuPress,
  onSearchPress,
  onNotificationsPress,
  onProfilePress,
  showSearch = true,
  showNotifications = true,
  showMenu = true,
}: HomeHeaderProps) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const handleMenu = onMenuPress || (() => navigation.openDrawer?.());
  const handleSearch = onSearchPress || (() => navigation.navigate?.('Search'));
  const handleNotifications =
    onNotificationsPress || (() => navigation.navigate?.('Notifications'));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          paddingTop: insets.top + (Platform.OS === 'ios' ? 6 : 10),
        },
      ]}>
      <View style={styles.left}>
        <Logo width={100} height={46} />
      </View>

      <View style={styles.actions}>
        {showSearch && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search mentors"
            onPress={handleSearch}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={({pressed}) => [
              styles.iconBtn,
              {
                backgroundColor: theme.colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Image
              source={require('../../assets/icons/tabs/explore.png')}
              style={[styles.actionIcon, {tintColor: theme.colors.text}]}
              resizeMode="contain"
            />
          </Pressable>
        )}

        {showNotifications && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={handleNotifications}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={({pressed}) => [
              styles.iconBtn,
              {
                backgroundColor: theme.colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Image
              source={require('../../assets/icons/bell.png')}
              style={[styles.actionIcon, {tintColor: theme.colors.text}]}
              resizeMode="contain"
            />
            <View
              style={[
                styles.badgeDot,
                {backgroundColor: theme.colors.secondary},
              ]}
            />
          </Pressable>
        )}

        {showMenu && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={handleMenu}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            style={({pressed}) => [
              styles.iconBtn,
              {
                backgroundColor: theme.colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <AssetIcon name="hamburger" size={20} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 9,
    right: 9,
  },
});
