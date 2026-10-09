import React from 'react';
import {Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle} from 'react-native';
import {colors, spacing} from '../../theme';

type ButtonProps = {title: string; onPress: () => void; variant?: 'primary' | 'outline' | 'soft'; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>};
export default function Button({title, onPress, variant = 'primary', loading = false, disabled = false, style}: ButtonProps) { return <Pressable disabled={disabled || loading} accessibilityRole="button" accessibilityState={{disabled}} accessibilityLabel={title} onPress={onPress} style={({pressed}) => [styles.base, styles[variant], (pressed || disabled) && styles.pressed, style]}>{loading ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} /> : <Text style={[styles.text, (variant === 'outline' || variant === 'soft') && styles.outlineText]}>{title}</Text>}</Pressable>; }
const styles = StyleSheet.create({base:{minHeight:52,borderRadius:14,alignItems:'center',justifyContent:'center',paddingHorizontal:spacing.lg},primary:{backgroundColor:colors.primary},outline:{borderWidth:1,borderColor:colors.primary,backgroundColor:colors.white},soft:{backgroundColor:colors.secondary},text:{fontSize:16,fontWeight:'700',color:colors.white},outlineText:{color:colors.primary},pressed:{opacity:.45}});
