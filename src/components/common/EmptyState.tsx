import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from './Button';
import {useTheme} from '../../theme/useTheme';

export default function EmptyState({title, description, action, actionTitle}: any) {
  const {theme} = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.icon, {color: theme.colors.accent}]}>◌</Text>
      <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
        {title}
      </Text>
      <Text style={[styles.text, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
        {description}
      </Text>
      {action && (
        <Button
          title={actionTitle}
          onPress={action}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 20,
    marginTop: 14,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    marginTop: 24,
    minWidth: 160,
  },
});
