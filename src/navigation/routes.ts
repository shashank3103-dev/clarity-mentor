export const routes = {
  splash: 'Splash', onboarding: 'Onboarding', login: 'Login', signup: 'Signup', verifyOtp: 'VerifyOtp',
  forgotPassword: 'ForgotPassword',
  main: 'Main', home: 'Home', explore: 'Explore', sessions: 'Sessions', messages: 'Messages', profile: 'Profile',
  dashboard: 'Dashboard',
  search: 'Search', decision: 'Decision', mentorList: 'MentorList', mentorDetails: 'MentorDetails',
  mentorReviews: 'MentorReviews', selectDate: 'SelectDate', selectTime: 'SelectTime', booking: 'Booking',
  bookingSuccess: 'BookingSuccess', sessionDetails: 'SessionDetails', editProfile: 'EditProfile',
  notifications: 'Notifications', settings: 'Settings', becomeMentor: 'BecomeMentor', helpSupport: 'HelpSupport',
  chat: 'Chat', paymentHistory: 'PaymentHistory', availability: 'Availability', wallet: 'Wallet',
} as const;

// Where to land after login, by role (web: seeker -> /experts, mentor -> /dashboard/mentor).
export const homeRouteFor = (userType?: string | null) => ({
  name: routes.main,
  params: {screen: 'Tabs', params: {screen: userType === 'mentor' ? routes.dashboard : routes.home}},
});
