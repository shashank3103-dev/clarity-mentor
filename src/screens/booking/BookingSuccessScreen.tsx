import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import {useTheme} from '../../theme/useTheme';
import { colors } from '../../theme';

export default function BookingSuccessScreen({navigation}: any) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const booking = useSelector((s: any) => s.booking);
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
  }, [scale]);

  const go = (screen: string) =>
    navigation.reset({
      index: 0,
      routes: [{name: 'Main', params: {screen: 'Tabs', params: {screen}}}],
    });

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: 20,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
        },
      ]}>
      {/* Animated Success Badge */}
      <Animated.View
        style={[
          styles.checkWrap,
          {
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: theme.colors.success,
            transform: [{scale}],
          },
        ]}>
        <Image
          source={require('../../assets/icons/tabs/check.png')}
          style={styles.checkIcon}
          resizeMode="contain"
        />
      </Animated.View>

      <Text
        style={[
          styles.title,
          {color: theme.colors.text, fontFamily: theme.fonts.bold},
        ]}>
        You're booked!
      </Text>

      <Text
        style={[
          styles.body,
          {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
        ]}>
        Your clarity session with{' '}
        <Text
          style={{color: theme.colors.text, fontFamily: theme.fonts.bold}}>
          {booking.mentor?.name}
        </Text>{' '}
        is confirmed.
      </Text>

      {/* Booking Details Card with Dedicated Icon Assets */}
      <View
        style={[
          styles.detailsCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        {/* Date Row */}
        <View style={styles.detailRow}>
          <View
            style={[
              styles.iconBox,
              {backgroundColor: theme.colors.surfaceMuted},
            ]}>
            <Image
              source={require('../../assets/icons/tabs/sessions.png')}
              style={[styles.rowIcon, {tintColor: theme.colors.secondary}]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.rowTextWrap}>
            <Text
              style={[
                styles.rowLabel,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.medium},
              ]}>
              Date
            </Text>
            <Text
              style={[
                styles.rowValue,
                {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
              ]}>
              {booking.date}
            </Text>
          </View>
        </View>

        <View
          style={[styles.divider, {backgroundColor: theme.colors.divider}]}
        />

        {/* Time Row */}
        <View style={styles.detailRow}>
          <View
            style={[
              styles.iconBox,
              {backgroundColor: theme.colors.surfaceMuted},
            ]}>
            <Image
              source={require('../../assets/icons/clock.png')}
              style={[styles.rowIcon, {tintColor: theme.colors.secondary}]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.rowTextWrap}>
            <Text
              style={[
                styles.rowLabel,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.medium},
              ]}>
              Time
            </Text>
            <Text
              style={[
                styles.rowValue,
                {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
              ]}>
              {booking.time}
            </Text>
          </View>
        </View>

        <View
          style={[styles.divider, {backgroundColor: theme.colors.divider}]}
        />

        {/* Duration Row */}
        <View style={styles.detailRow}>
          <View
            style={[
              styles.iconBox,
              {backgroundColor: theme.colors.surfaceMuted},
            ]}>
            <Image
              source={require('../../assets/icons/hourglass.png')}
              style={[styles.rowIcon, {tintColor: theme.colors.secondary}]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.rowTextWrap}>
            <Text
              style={[
                styles.rowLabel,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.medium},
              ]}>
              Duration
            </Text>
            <Text
              style={[
                styles.rowValue,
                {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
              ]}>
              30 minutes
            </Text>
          </View>
        </View>
      </View>

      <Button
        title="View session"
        onPress={() => go('Sessions')}
        height={48}
        style={styles.btn}
      />
      <Button
        title="Back to home"
        variant="soft"
        height={46}
        onPress={() => go('Home')}
        style={styles.home}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrap: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 48,
    height: 48,
    tintColor:colors.success
  },
  title: {
    fontSize: 24,
    marginTop: 18,
    letterSpacing: -0.3,
  },
  body: {
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    fontSize: 13.5,
    paddingHorizontal: 16,
  },
  detailsCard: {
    marginVertical: 22,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIcon: {
    width: 18,
    height: 18,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 10.5,
  },
  rowValue: {
    fontSize: 13.5,
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    marginVertical: 10,
  },
  btn: {
    width: '100%',
  },
  home: {
    marginTop: 10,
    width: '100%',
  },
});
