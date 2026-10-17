import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function BecomeMentorScreen({navigation}: any) {
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
          onPress={() => navigation.navigate('Signup', {role: 'mentor'})}
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
