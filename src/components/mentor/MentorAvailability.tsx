import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function MentorAvailability({times = []}: any) {
  const {theme} = useTheme();

  return (
    <View style={styles.row}>
      {times.slice(0, 3).map((x: string) => (
        <View
          key={x}
          style={[
            styles.chip,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.text,
              {
                color: theme.colors.text,
                fontFamily: theme.fonts.medium,
              },
            ]}>
            {x}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 12.5,
  },
});
