import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

const reviews = [
  ['Priya S.', 'I came in overwhelmed and left with a plan I could actually act on.'],
  ['Rohan M.', 'Warm, candid advice that helped me name what mattered.'],
  ['Tanvi K.', 'A generous listener with very practical insights.'],
];

export default function MentorReviewsScreen() {
  const {theme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader title="Reviews" showBack />
      <ScrollView contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          What mentees say
        </Text>
        {reviews.map(([n, r]) => (
          <View
            key={n}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text style={[styles.stars, {color: theme.colors.star}]}>★★★★★</Text>
            <Text style={[styles.copy, {color: theme.colors.text, fontFamily: theme.fonts.regular}]}>
              "{r}"
            </Text>
            <Text style={[styles.name, {color: theme.colors.mutedText, fontFamily: theme.fonts.bold}]}>
              {n}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  stars: {
    fontSize: 16,
    letterSpacing: 2,
  },
  copy: {
    fontSize: 15,
    lineHeight: 23,
    marginVertical: 10,
  },
  name: {
    fontSize: 13,
  },
});
