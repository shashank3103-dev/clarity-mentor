import api from './axiosInstance';

/**
 * Booking APIs.
 *
 * Covers session booking, slot selection, rescheduling, cancellation,
 * order creation, payment verification, and coupons.
 */

export interface CreateBookingPayload {
  profile_slug: string;
  session_date: string; // YYYY-MM-DD
  time_slot_id: number | string;
  duration_minutes?: number;
  notes?: string;
}

export interface RescheduleBookingPayload {
  booking_id: string | number;
  new_date: string;
  time_slot_id: string | number;
}

export interface CancelBookingPayload {
  booking_id: string | number;
  reason?: string;
}

export interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Book a session with a mentor. */
export const createBooking = (data: CreateBookingPayload) =>
  api.post('/booking/book', data);

/** Reschedule an existing booking. */
export const rescheduleBooking = (data: RescheduleBookingPayload) =>
  api.post('/booking/reschedule', data);

/** Cancel a booking. */
export const cancelBooking = (data: CancelBookingPayload) =>
  api.post('/booking/cancel', data);

/** Create payment order (e.g., Razorpay order). */
export const createBookingOrder = (data: {
  booking_id?: string | number;
  amount?: number;
  currency?: string;
  [key: string]: any;
}) => api.post('/booking/create-order', data);

/** Verify Razorpay payment signature. */
export const verifyBookingPayment = (data: PaymentVerificationPayload) =>
  api.post('/booking/verify-payment', data);

/** Validate a coupon code. */
export const validateCouponCode = (coupon_code: string) =>
  api.get('/booking/coupon-code', {params: {coupon_code}});

/** Submit post-session feedback. */
export const submitSessionFeedback = (data: {
  session_id: string | number;
  rating: number;
  feedback?: string;
}) => api.post('/booking/session-feedback', data);

/** Lookup mentor availability settings for booking slots. */
export const getMentorAvailabilityForBooking = (profileSlug: string) =>
  api.get(`/mentor/availability/settings/${profileSlug}`);
