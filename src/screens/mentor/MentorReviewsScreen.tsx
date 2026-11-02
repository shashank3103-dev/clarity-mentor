import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import CustomHeader from '../../components/common/CustomHeader';
import {useSelector} from 'react-redux';
import {useTheme} from '../../theme/useTheme';
import EmptyState from '../../components/common/EmptyState';
import {formatDateTime} from '../../utils/mentor';

const stars = (rating: any) =>
  '★'.repeat(Math.round(Number(rating) || 0)).padEnd(5, '☆');

export default function MentorReviewsScreen() {
  const {theme} = useTheme();
  const mentor = useSelector((st: any) => st.mentors.selected);
  const reviews: any[] = mentor?.reviews || [];

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader title="Reviews" showBack />
      <ScrollView contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          What mentees say
        </Text>
        {!reviews.length ? (
          <EmptyState title="No reviews yet" description="Reviews appear here after completed sessions." />
        ) : null}
        {reviews.map((r, idx) => (
          <View
            key={r.id || idx}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text style={[styles.stars, {color: theme.colors.star}]}>{stars(r.rating)}</Text>
            <Text style={[styles.copy, {color: theme.colors.text, fontFamily: theme.fonts.regular}]}>
              "{r.review || r.comment || ''}"
            </Text>
            <Text style={[styles.name, {color: theme.colors.mutedText, fontFamily: theme.fonts.bold}]}>
              {r.seeker_name || r.full_name || 'Seeker'}
              {r.created_at ? ' · ' + formatDateTime(r.created_at) : ''}
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
