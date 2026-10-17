import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import CustomHeader from '../../components/common/CustomHeader';
import {addSession} from '../../redux/slices/sessionSlice';
import {clearBooking} from '../../redux/slices/bookingSlice';
import {createBooking} from '../../services/bookingService';
import {useTheme} from '../../theme/useTheme';

export default function BookingScreen({navigation}: any) {
  const {theme} = useTheme();
  const booking = useSelector((s: any) => s.booking);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await createBooking({
        profile_slug:
          booking.mentor?.slug ||
          booking.mentor?.name?.toLowerCase().replace(/\s+/g, '-'),
        mentor: booking.mentor,
        date: booking.date,
        time: booking.time,
        notes: `Mentorship session on ${booking.mentor?.expertise?.[0] || 'career'}`,
      });

      dispatch(
        addSession({
          ...booking,
          id: String(res?.id || res?.data?.id || Date.now()),
          status: 'upcoming',
        }),
      );
      dispatch(clearBooking());
      navigation.replace('BookingSuccess');
    } catch (err: any) {
      setError(
        err?.message ||
        err?.data?.message ||
        'Unable to complete booking. Please try again.',
      );
    } finally {
      setLoading(false);
    }
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

        {error ? <ErrorMessage message={error} /> : null}

        <BookingCard
          mentor={booking.mentor}
          date={booking.date}
          time={booking.time}
        />

        <Button
          title="Confirm booking"
          onPress={confirm}
          loading={loading}
          disabled={loading}
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
