import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookingCard from '../../components/booking/BookingCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import CustomHeader from '../../components/common/CustomHeader';
import {bookingConfirmed, setNotes} from '../../redux/slices/bookingSlice';
import {useTheme} from '../../theme/useTheme';
import {bookAndPay, PaymentCancelledError} from '../../services/paymentService';
import {formatLongDate, slotDurationMinutes} from '../../utils/mentor';

export default function BookingScreen({navigation}: any) {
  const {theme} = useTheme();
  const booking = useSelector((s: any) => s.booking);
  const user = useSelector((s: any) => s.auth.user);
  const dispatch = useDispatch();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!booking.mentor || !booking.slot) return null;

  const duration = slotDurationMinutes(booking.slot);
  const amount = Math.ceil(booking.mentor.price || 0);

  const pay = async () => {
    setPaying(true);
    setError(null);
    try {
      const {sessionId} = await bookAndPay(
        {
          profile_slug: booking.mentor.slug,
          session_date: booking.date,
          time_slot_id: booking.slot.id,
          duration_minutes: duration,
          notes: booking.notes || '',
          conversation_id: booking.conversationId || undefined,
        },
        {name: user?.full_name, email: user?.email, contact: user?.phone || user?.mobile || ''},
      );
      dispatch(bookingConfirmed(sessionId));
      navigation.replace('BookingSuccess');
    } catch (e: any) {
      if (e instanceof PaymentCancelledError) {
        setError('Payment cancelled. Your slot is not booked yet.');
      } else {
        setError(e?.message);
        Alert.alert('Payment failed', e?.message || 'Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Confirm Booking" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, {paddingHorizontal: 20}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.step, {color: theme.colors.secondary, fontFamily: theme.fonts.bold}]}>
          STEP 3 OF 3
        </Text>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Confirm & pay
        </Text>
        <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
          You'll get a confirmation email and a private meeting link for your session.
        </Text>

        <BookingCard
          mentor={booking.mentor}
          date={formatLongDate(booking.date)}
          time={booking.slot.label}
          duration={duration}
          price={amount}
        />

        <View style={{marginTop: 18}}>
          <Input
            label="Additional notes (optional)"
            value={booking.notes}
            onChangeText={(v: string) => dispatch(setNotes(v))}
            placeholder="Tell the mentor what you'd like to discuss..."
            multiline
          />
        </View>

        {error ? (
          <Text style={[styles.error, {color: theme.colors.error, fontFamily: theme.fonts.medium}]}>{error}</Text>
        ) : null}

        <Button
          title={`Proceed to payment (₹${amount})`}
          onPress={pay}
          loading={paying}
          style={styles.button}
        />
        <Text style={[styles.secure, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
          Payments are processed securely by Razorpay.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {paddingTop: 12, paddingBottom: 40},
  step: {fontSize: 10, letterSpacing: 1.1, marginTop: 8},
  title: {fontSize: 22, marginTop: 6},
  body: {fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: 20},
  error: {fontSize: 13, textAlign: 'center', marginTop: 4},
  button: {marginTop: 14, height: 50},
  secure: {fontSize: 11.5, textAlign: 'center', marginTop: 10},
});
