import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slices/authSlice';
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function BecomeMentorScreen({navigation}: any) {
  const isAuthenticated = useSelector((st: any) => st.auth.isAuthenticated);
  const dispatch = useDispatch<any>();
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Become a Mentor"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, {color: theme.colors.secondary, fontFamily: theme.fonts.bold}]}>
          SHARE WHAT YOU'VE LEARNED
        </Text>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Someone needs the experience you already have.
        </Text>
        <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
          Join a thoughtful network of mentors and make a real difference through private, 1-on-1 conversations. Turn your lived experiences into stepping stones for others.
        </Text>
        <Button
          title="Apply to become a mentor"
          onPress={async () => {
            // Mentor accounts are separate on the backend, so sign out and register as a mentor.
            // Reset on whichever ancestor navigator owns the auth screens (root stack).
            let nav = navigation;
            while (nav && !nav.getState()?.routeNames?.includes('Login')) nav = nav.getParent();
            (nav || navigation).reset({
              index: 1,
              routes: [{name: 'Login'}, {name: 'Signup', params: {role: 'mentor'}}],
            });
            if (isAuthenticated) dispatch(logout());
          }}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 14,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 28,
  },
  button: {
    marginTop: 8,
  },
});
