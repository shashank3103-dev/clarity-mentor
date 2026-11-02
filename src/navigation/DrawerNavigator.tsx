import React from 'react';
import {View, Text, Pressable, StyleSheet, Platform, Image} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import BottomTabs from './BottomTabNavigator';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import BecomeMentorScreen from '../screens/misc/BecomeMentorScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpSupportScreen from '../screens/misc/HelpSupportScreen';
import Avatar from '../components/common/Avatar';
import Logo from '../components/common/Logo';
import {useTheme} from '../theme/useTheme';
import {logout} from '../redux/slices/authSlice';
import {imageUrl} from '../utils/mentor';
import {initials} from '../utils/helpers';

const Drawer = createDrawerNavigator();

const TAB_ROUTES = ['Home', 'Explore', 'Sessions', 'Messages', 'Profile', 'Dashboard'];

const seekerItems = [
  ['Home', 'Home'],
  ['Find a mentor', 'Explore'],
  ['My sessions', 'Sessions'],
  ['Messages', 'Messages'],
  ['Payment history', 'PaymentHistory'],
  ['Become a mentor', 'BecomeMentor'],
  ['Settings', 'Settings'],
  ['Help & support', 'HelpSupport'],
];

const mentorItems = [
  ['Dashboard', 'Dashboard'],
  ['My sessions', 'Sessions'],
  ['Messages', 'Messages'],
  ['Availability', 'Availability'],
  ['Payment history', 'PaymentHistory'],
  ['Wallet & payouts', 'Wallet'],
  ['Settings', 'Settings'],
  ['Help & support', 'HelpSupport'],
];

function Content(props: any) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<any>();
  const {user, userType} = useSelector((s: any) => s.auth);
  const items = userType === 'mentor' ? mentorItems : seekerItems;

  const go = (route: string) =>
    TAB_ROUTES.includes(route)
      ? props.navigation.navigate('Tabs', {screen: route})
      : props.navigation.navigate(route);

  // RootNavigator's session guard sends us to Login once auth clears.
  const handleLogout = () => {
    props.navigation.closeDrawer();
    dispatch(logout());
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 16),
          backgroundColor: theme.colors.background,
        },
      ]}>
      {/* Brand & Profile */}
      <View style={[styles.brand, {borderColor: theme.colors.divider}]}>
        <View style={styles.logoWrap}>
          <Logo width={110} height={48} />
        </View>
        <View style={styles.profile}>
          <Avatar
            label={initials(user?.full_name || 'CM')}
            uri={imageUrl(user?.profile_image)}
            size={44}
          />
          <View style={styles.profileText}>
            <Text
              style={[
                styles.name,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              {user?.full_name || 'Welcome'}
            </Text>
            <Text
              style={[
                styles.role,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.regular,
                },
              ]}>
              {user?.expertise_area || user?.email || (userType === 'mentor' ? 'Mentor' : 'Seeker')}
            </Text>
          </View>
        </View>
      </View>

      {/* Explore section */}
      <Text
        style={[
          styles.label,
          {color: theme.colors.mutedText, fontFamily: theme.fonts.bold},
        ]}>
        EXPLORE
      </Text>
      {items.slice(0, 5).map(([label, route]) => (
        <Pressable
          key={route}
          onPress={() => go(route)}
          accessibilityRole="button"
          style={({pressed}) => [
            styles.item,
            pressed && {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          <Text
            style={[
              styles.itemText,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            {label}
          </Text>
          <Image
            source={require('../assets/icons/tabs/chevron-right.png')}
            style={[styles.chevron, {tintColor: theme.colors.secondary}]}
            resizeMode="contain"
          />
        </Pressable>
      ))}

      {/* More section */}
      <View
        style={[styles.divider, {backgroundColor: theme.colors.divider}]}
      />
      <Text
        style={[
          styles.label,
          {color: theme.colors.mutedText, fontFamily: theme.fonts.bold},
        ]}>
        MORE
      </Text>
      {items.slice(5).map(([label, route]) => (
        <Pressable
          key={route}
          onPress={() => go(route)}
          accessibilityRole="button"
          style={({pressed}) => [
            styles.item,
            pressed && {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          <Text
            style={[
              styles.itemText,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            {label}
          </Text>
          <Image
            source={require('../assets/icons/tabs/chevron-right.png')}
            style={[styles.chevron, {tintColor: theme.colors.secondary}]}
            resizeMode="contain"
          />
        </Pressable>
      ))}

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        accessibilityRole="button"
        style={[styles.logout, {backgroundColor: theme.colors.surfaceMuted}]}>
        <Text
          style={[
            styles.logoutText,
            {color: theme.colors.error, fontFamily: theme.fonts.bold},
          ]}>
          Log out
        </Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const {theme} = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={props => <Content {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {backgroundColor: theme.colors.background, width: 300},
      }}>
      <Drawer.Screen name="Tabs" component={BottomTabs} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="BecomeMentor" component={BecomeMentorScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  brand: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
  },
  logoWrap: {
    marginBottom: 12,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 15,
  },
  role: {
    fontSize: 11.5,
    marginTop: 2,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 18,
    marginLeft: 20,
    marginBottom: 6,
  },
  item: {
    minHeight: 46,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 13.5,
  },
  chevron: {
    width: 12,
    height: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 12,
  },
  logout: {
    margin: 20,
    marginTop: 24,
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 13.5,
  },
});
