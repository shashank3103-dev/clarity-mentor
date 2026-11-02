import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Button from './Button';
import {useTheme} from '../../theme/useTheme';

type Props = {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

/** Full-area loader / error with retry. Renders nothing when neither applies. */
export default function ScreenState({loading, error, onRetry}: Props) {
  const {theme} = useTheme();
  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={theme.colors.secondary} size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.wrap}>
        <Text style={[styles.text, {color: theme.colors.error, fontFamily: theme.fonts.medium}]}>
          {error}
        </Text>
        {onRetry ? (
          <Button title="Try again" variant="outline" height={42} onPress={onRetry} style={styles.btn} />
        ) : null}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  wrap: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 200},
  text: {fontSize: 14, textAlign: 'center', lineHeight: 20},
  btn: {marginTop: 16, minWidth: 140},
});
