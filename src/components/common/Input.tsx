import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function Input({
  label,
  error,
  helperText,
  secureTextEntry,
  leftIcon,
  rightIcon,
  ...props
}: any) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const {theme} = useTheme();
  
  const password = Boolean(secureTextEntry);
  
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : focused ? theme.colors.secondary : theme.colors.border,
            borderRadius: theme.radius.sm,
          },
        ]}
      >
        {leftIcon}
        <TextInput
          accessibilityLabel={label || props.placeholder}
          accessibilityHint={error || helperText}
          placeholderTextColor={theme.colors.mutedText}
          style={[
            styles.input,
            {color: theme.colors.text, fontFamily: theme.fonts.regular},
            props.multiline && styles.multi,
          ]}
          secureTextEntry={password && !show}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          {...props}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={show ? 'Hide password' : 'Show password'}
            onPress={() => setShow(!show)}
          >
            <Text style={{fontSize: 12, fontFamily: theme.fonts.bold, color: theme.colors.secondary}}>
              {show ? 'HIDE' : 'SHOW'}
            </Text>
          </Pressable>
        ) : (
          rightIcon
        )}
      </View>
      {error || helperText ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.help,
            {
              color: error ? theme.colors.error : theme.colors.mutedText,
              fontFamily: theme.fonts.regular,
            },
          ]}
        >
          {error || helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 7,
  },
  field: {
    minHeight: 52,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 16,
  },
  multi: {
    height: 118,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  help: {
    fontSize: 12,
    marginTop: 5,
    lineHeight: 16,
  },
});
