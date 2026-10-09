import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {completeOnboarding} from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import {useTheme} from '../../theme/useTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const slides = [
  [
    'Decisions feel lighter with someone who has been there.',
    'Find a real person with relevant lived experience.',
  ],
  [
    'One conversation can create momentum.',
    'Book a private, 1-on-1 clarity session at a time that works for you.',
  ],
  [
    'Your next move starts here.',
    'Thoughtful guidance. No judgement. Complete privacy.',
  ],
];

const images = [
  require('../../assets/images/onboarding/conversation.jpg'),
  require('../../assets/images/onboarding/booking.jpg'),
  require('../../assets/images/onboarding/clarity.jpg'),
];

export default function OnboardingScreen({navigation}: any) {
  const [i, setI] = useState(0);
  const d = useDispatch();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const handleFinish = () => {
    d(completeOnboarding());
    navigation.replace('Login');
  };

  const next = () => (i < 2 ? setI(i + 1) : handleFinish());

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 14),
          paddingBottom: insets.bottom + 20,
        },
      ]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Header bar with Logo and Skip */}
      <View style={styles.topBar}>
        <Logo width={116} height={46} />
        {i < 2 ? (
          <Pressable
            onPress={handleFinish}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            accessibilityRole="button">
            <Text
              style={[
                styles.skipText,
                {color: theme.colors.mutedText, fontFamily: theme.fonts.medium},
              ]}>
              Skip
            </Text>
          </Pressable>
        ) : (
          <View style={{width: 32}} />
        )}
      </View>

      {/* Slide Illustration */}
      <View style={[styles.imageContainer, {backgroundColor: theme.colors.surfaceMuted}]}>
        <Image source={images[i]} style={styles.imageCard} />
      </View>

      {/* Slide Text Content */}
      <View style={styles.textWrap}>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {slides[i][0]}
        </Text>
        <Text
          style={[
            styles.body,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          {slides[i][1]}
        </Text>
      </View>

      {/* Footer with Dots & Action Buttons */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, x) => (
            <View
              key={x}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    x === i ? theme.colors.secondary : theme.colors.border,
                },
                x === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Button
          title={i === 2 ? 'Get started' : 'Continue'}
          onPress={next}
          height={48}
        />
        <Button
          title="I already have an account"
          variant="soft"
          height={46}
          style={styles.login}
          onPress={() => navigation.replace('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 13,
    paddingHorizontal: 4,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 14,
  },
  imageCard: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  textWrap: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 8,
  },
  footer: {
    marginTop: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeDot: {
    width: 22,
    borderRadius: 4,
  },
  login: {
    marginTop: 10,
  },
});
