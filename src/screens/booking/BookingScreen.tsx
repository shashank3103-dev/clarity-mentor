import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {addSession} from '../../redux/slices/sessionSlice';
import {useTheme} from '../../theme/useTheme';

export default function BookingScreen({navigation}: any) {
  const {theme} = useTheme();
  const booking = useSelector((s: any) => s.booking);
  const dispatch = useDispatch();

  const confirm = () => {
    dispatch(addSession(booking));
    navigation.replace('BookingSuccess');
  };

  if (!booking.mentor) return null;

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Confirm Booking"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.content, {paddingHorizontal: 20}]}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.step,
            {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
          ]}>
          STEP 3 OF 3
        </Text>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          Confirm your booking
        </Text>
        <Text
          style={[
            styles.body,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          You'll get a calendar invitation and private meeting link.
        </Text>

        <BookingCard
          mentor={booking.mentor}
          date={booking.date}
          time={booking.time}
        />

        <Button
          title="Confirm booking"
          onPress={confirm}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  step: {
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    marginTop: 6,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 20,
  },
  button: {
    marginTop: 22,
    height: 48,
  },
});
