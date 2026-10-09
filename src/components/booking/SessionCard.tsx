import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Avatar from '../common/Avatar';
import {useTheme} from '../../theme/useTheme';

export default function SessionCard({session}: any) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <Avatar label={session.mentor?.image} />
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {session.mentor?.name}
        </Text>
        <Text
          style={[
            styles.meta,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          {session.date} · {session.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  meta: {
    fontSize: 13,
    marginTop: 4,
  },
});
