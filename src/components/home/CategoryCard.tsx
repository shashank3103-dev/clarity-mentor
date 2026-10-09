import React from 'react';
import {Pressable, Text, StyleSheet, Image, View} from 'react-native';
import {useTheme} from '../../theme/useTheme';

export default function CategoryCard({item, onPress}: any) {
  const {theme} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <View
        style={[
          styles.iconBox,
          {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
        ]}>
        {typeof item.icon === 'number' || typeof item.icon === 'object' ? (
          <Image
            source={item.icon}
            style={[styles.iconImg, {tintColor: theme.colors.secondary}]}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.iconText, {color: theme.colors.secondary}]}>
            {item.icon}
          </Text>
        )}
      </View>

      <View style={styles.textWrap}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {item.label}
        </Text>
        {item.subtitle ? (
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    minHeight: 112,
    borderRadius: 16,
    padding: 13,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 18,
    height: 18,
  },
  iconText: {
    fontSize: 18,
  },
  textWrap: {
    marginTop: 8,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 2,
  },
});
