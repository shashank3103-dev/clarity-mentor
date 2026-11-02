import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import Splash from '../screens/auth/SplashScreen';
import Onboarding from '../screens/auth/OnboardingScreen';
import Login from '../screens/auth/LoginScreen';
import Signup from '../screens/auth/SignupScreen';
import VerifyOtp from '../screens/auth/VerifyOtpScreen';
import Forgot from '../screens/auth/ForgotPasswordScreen';
import Main from './DrawerNavigator';
import Search from '../screens/home/SearchScreen';
import Categories from '../screens/home/CategoriesScreen';
import Decision from '../screens/home/DecisionScreen';
import MentorList from '../screens/mentor/MentorListScreen';
import MentorDetails from '../screens/mentor/MentorDetailsScreen';
import MentorReviews from '../screens/mentor/MentorReviewsScreen';
import SelectDate from '../screens/booking/SelectDateScreen';
import SelectTime from '../screens/booking/SelectTimeScreen';
import Booking from '../screens/booking/BookingScreen';
import BookingSuccess from '../screens/booking/BookingSuccessScreen';
import SessionDetails from '../screens/sessions/SessionDetailsScreen';
import EditProfile from '../screens/profile/EditProfileScreen';
import Notifications from '../screens/notifications/NotificationsScreen';
import BecomeMentor from '../screens/misc/BecomeMentorScreen';
import HelpSupport from '../screens/misc/HelpSupportScreen';
import Chat from '../screens/messages/ChatScreen';
import PaymentHistory from '../screens/payments/PaymentHistoryScreen';
import Availability from '../screens/mentorPanel/AvailabilityScreen';
import Wallet from '../screens/mentorPanel/WalletScreen';
import {routes} from './routes';

const Stack = createNativeStackNavigator();
const AUTH_ROUTES: string[] = [routes.login, routes.signup, routes.verifyOtp, routes.forgotPassword, routes.onboarding];

// Sends the user back to Login if the backend rejects the token mid-session.
function useSessionGuard() {
  const navigation = useNavigation<any>();
  const {isAuthenticated, bootstrapped} = useSelector((s: any) => s.auth);
  const wasAuthenticated = useRef(isAuthenticated);
  useEffect(() => {
    const current = navigation.getCurrentRoute?.()?.name;
    if (bootstrapped && wasAuthenticated.current && !isAuthenticated && !AUTH_ROUTES.includes(current)) {
      navigation.reset({index: 0, routes: [{name: routes.login}]});
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, bootstrapped, navigation]);
}

export default function RootNavigator() {
  useSessionGuard();
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name={routes.splash} component={Splash} />
      <Stack.Screen name={routes.onboarding} component={Onboarding} />
      <Stack.Screen name={routes.login} component={Login} />
      <Stack.Screen name={routes.signup} component={Signup} />
      <Stack.Screen name={routes.verifyOtp} component={VerifyOtp} />
      <Stack.Screen name={routes.forgotPassword} component={Forgot} />
      <Stack.Screen name={routes.main} component={Main} />
      <Stack.Screen name={routes.search} component={Search} />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name={routes.decision} component={Decision} />
      <Stack.Screen name={routes.mentorList} component={MentorList} />
      <Stack.Screen name={routes.mentorDetails} component={MentorDetails} />
      <Stack.Screen name={routes.mentorReviews} component={MentorReviews} />
      <Stack.Screen name={routes.selectDate} component={SelectDate} />
      <Stack.Screen name={routes.selectTime} component={SelectTime} />
      <Stack.Screen name={routes.booking} component={Booking} />
      <Stack.Screen name={routes.bookingSuccess} component={BookingSuccess} />
      <Stack.Screen name={routes.sessionDetails} component={SessionDetails} />
      <Stack.Screen name={routes.editProfile} component={EditProfile} />
      <Stack.Screen name={routes.notifications} component={Notifications} />
      <Stack.Screen name={routes.becomeMentor} component={BecomeMentor} />
      <Stack.Screen name={routes.helpSupport} component={HelpSupport} />
      <Stack.Screen name={routes.chat} component={Chat} />
      <Stack.Screen name={routes.paymentHistory} component={PaymentHistory} />
      <Stack.Screen name={routes.availability} component={Availability} />
      <Stack.Screen name={routes.wallet} component={Wallet} />
    </Stack.Navigator>
  );
}
