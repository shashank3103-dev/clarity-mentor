import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function ErrorMessage({message}: {message: string}) {
  const {theme} = useTheme();

  return (
    <Text
      style={[
        styles.text,
        {
          color: theme.colors.error,
          fontFamily: theme.fonts.medium,
        },
      ]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 12,
    fontSize: 14,
  },
});
