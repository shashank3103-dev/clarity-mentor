import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../common/AssetIcon';

export default function SearchBar({onPress}: {onPress: () => void}) {
  const {theme} = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Search mentors"
      onPress={onPress}
      style={[
        styles.box,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <AssetIcon name="search" size="sm" style={styles.icon} />
      <Text
        style={[
          styles.text,
          {
            color: theme.colors.mutedText,
            fontFamily: theme.fonts.regular,
          },
        ]}>
        Search for mentors or topics...
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 15,
  },
});
