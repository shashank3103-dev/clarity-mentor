import React from 'react';
import {Image, StyleSheet, Platform, View} from 'react-native';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import MentorListScreen from '../screens/mentor/MentorListScreen';
import MySessionsScreen from '../screens/sessions/MySessionsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MessagesScreen from '../screens/messages/MessagesScreen';
import MentorDashboardScreen from '../screens/mentorPanel/MentorDashboardScreen';
import ChatIcon from '../components/common/ChatIcon';
import {useTheme} from '../theme/useTheme';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, any> = {
  Home: require('../assets/icons/tabs/home.png'),
  Dashboard: require('../assets/icons/tabs/home.png'),
  Explore: require('../assets/icons/tabs/explore.png'),
  Sessions: require('../assets/icons/tabs/sessions.png'),
  Profile: require('../assets/icons/tabs/profile.png'),
};

export default function BottomTabNavigator() {
  const {theme} = useTheme();
  const userType = useSelector((s: any) => s.auth.userType);
  const isMentor = userType === 'mentor';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: theme.fonts.semiBold,
          marginTop: 2,
        },
        tabBarIcon: ({focused, color}) => {
          const icon = tabIcons[route.name];
          return (
            <View
              style={[
                styles.iconWrap,
                focused && {backgroundColor: theme.colors.surfaceMuted},
              ]}>
              {icon ? (
                <Image
                  source={icon}
                  style={[
                    styles.icon,
                    {tintColor: color, opacity: focused ? 1 : 0.5},
                  ]}
                  resizeMode="contain"
                />
              ) : (
                <View style={{opacity: focused ? 1 : 0.5}}>
                  <ChatIcon size={22} color={color} />
                </View>
              )}
            </View>
          );
        },
      })}>
      {isMentor ? (
        <Tab.Screen name="Dashboard" component={MentorDashboardScreen} />
      ) : (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={MentorListScreen} />
        </>
      )}
      <Tab.Screen name="Sessions" component={MySessionsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
});
