import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../common/AssetIcon';

export default function MentorRating({
  rating,
  sessions,
}: {
  rating: number;
  sessions: number;
}) {
  const {theme} = useTheme();

  return (
    <View style={styles.row}>
      <AssetIcon name="star" size="xs" accessibilityLabel="Rating" />
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.star,
            fontFamily: theme.fonts.bold,
          },
        ]}>
        {rating ? Number(rating).toFixed(1) : 'New'}
      </Text>
      <Text
        style={[
          styles.muted,
          {
            color: theme.colors.mutedText,
            fontFamily: theme.fonts.medium,
          },
        ]}>
        {' '}· {sessions} review{sessions === 1 ? '' : 's'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 13,
  },
  muted: {
    fontSize: 13,
  },
});
