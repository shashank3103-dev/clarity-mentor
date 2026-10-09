import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function SessionDetailsScreen({route, navigation}: any) {
  const {theme} = useTheme();
  const s = route.params?.session;

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Session Details"
        onBack={() => navigation?.goBack?.()}
      />
      <View style={{flex: 1, padding: theme.spacing.lg}}>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {s?.mentor?.name || 'Your session'}
        </Text>
        <Text
          style={[
            styles.role,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          {s?.mentor?.role}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            WHEN
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            {s?.date} · {s?.time}
          </Text>

          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            DURATION
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            30 minutes
          </Text>

          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            PRIVATE SESSION
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            Your meeting link will be available here before the session.
          </Text>
        </View>

        <Button title="Join session" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    marginTop: 16,
  },
  role: {
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 24,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 14,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
});
