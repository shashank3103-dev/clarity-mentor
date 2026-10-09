import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function NotificationsScreen() {
  const {theme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader title="Notifications" showBack />
      <ScrollView contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={[styles.dot, {color: theme.colors.accent}]}>●</Text>
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.head,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Welcome to Clarity
            </Text>
            <Text
              style={[
                styles.body,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
              ]}>
              Start with a real conversation. Your next mentor is waiting.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  dot: {
    fontSize: 16,
    marginTop: 2,
  },
  head: {
    fontSize: 16,
  },
  body: {
    lineHeight: 20,
    marginTop: 4,
    fontSize: 14,
  },
});
