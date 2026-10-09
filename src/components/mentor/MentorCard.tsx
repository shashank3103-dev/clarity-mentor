import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Avatar from '../common/Avatar';
import MentorRating from './MentorRating';
import {useTheme} from '../../theme/useTheme';

function MentorCard({mentor, onPress, compact = false}: any) {
  const {theme} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${mentor.name}'s profile`}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        compact && styles.compact,
      ]}>
      <View style={styles.top}>
        <Avatar label={mentor.image} />
        <View style={styles.info}>
          <Text
            numberOfLines={1}
            style={[
              styles.name,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            {mentor.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.role,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {mentor.role} · {mentor.company}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.exp,
          {color: theme.colors.mutedText, fontFamily: theme.fonts.medium},
        ]}>
        {mentor.experience} experience
      </Text>

      <MentorRating rating={mentor.rating} sessions={mentor.sessions} />

      <View style={styles.chips}>
        {mentor.expertise.slice(0, 2).map((x: string) => (
          <Text
            key={x}
            style={[
              styles.chip,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.surfaceMuted,
                fontFamily: theme.fonts.semiBold,
              },
            ]}>
            {x}
          </Text>
        ))}
      </View>

      <View style={styles.bottom}>
        <Text
          style={[
            styles.price,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          From ₹{mentor.price}
        </Text>
        <Text
          style={[
            styles.link,
            {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
          ]}>
          View profile
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(MentorCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  compact: {
    width: 272,
    marginRight: 12,
    marginBottom: 0,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 11,
  },
  name: {
    fontSize: 16,
  },
  role: {
    fontSize: 13,
    marginTop: 2,
  },
  exp: {
    fontSize: 13,
    marginVertical: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  chip: {
    fontSize: 11,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  price: {
    fontSize: 14,
  },
  link: {
    fontSize: 13,
  },
});
