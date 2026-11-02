import {bookingService, BookSessionPayload} from './bookingService';
import {getErrorMessage} from './api';

type Prefill = {name?: string; email?: string; contact?: string};

export class PaymentCancelledError extends Error {}

const openCheckout = async (options: Record<string, any>) => {
  let RazorpayCheckout: any;
  try {
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch {
    throw new Error('Payment gateway is not available in this build. Please reinstall the app.');
  }
  try {
    return await RazorpayCheckout.open(options);
  } catch (e: any) {
    // code 0 = closed by user (Android), 2 = cancelled (iOS)
    if (e?.code === 0 || e?.code === 2) throw new PaymentCancelledError('Payment cancelled');
    let message = e?.description;
    try {
      message = JSON.parse(e?.description)?.error?.description || message;
    } catch {}
    throw new Error(message || 'Payment was declined. Please try again.');
  }
};

/**
 * Mirrors web razorpay-payment.tsx: create the booking/order on our backend,
 * open Razorpay checkout, then verify the signature on our backend.
 */
export async function bookAndPay(payload: BookSessionPayload, prefill: Prefill) {
  let booking;
  try {
    booking = await bookingService.book(payload);
  } catch (e) {
    throw new Error(getErrorMessage(e, 'Failed to book session. Please try again.'));
  }
  if (!booking?.status) throw new Error(booking?.message || 'Failed to book session');

  const payment = await openCheckout({
    key: booking.key_id,
    amount: Math.round(booking.amount * 100), // paise
    currency: booking.currency || 'INR',
    name: 'Clarity Mentor',
    description: `Mentorship Session - ${payload.duration_minutes} minutes`,
    image: 'https://claritymentor.io/images/logo.png',
    order_id: booking.razorpay_order_id,
    prefill,
    theme: {color: '#C9822B'},
  });

  let verification;
  try {
    verification = await bookingService.verifyPayment({
      ...booking,
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
    });
  } catch (e) {
    throw new Error(getErrorMessage(e, 'Payment verification failed. Please contact support.'));
  }
  if (verification?.status !== 'success') {
    throw new Error(verification?.message || 'Payment verification failed');
  }
  return {sessionId: verification.session_id || booking.session_id, amount: booking.amount};
}
