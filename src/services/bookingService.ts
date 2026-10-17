import {
  createBooking as apiCreateBooking,
  cancelBooking as apiCancelBooking,
} from '../api/bookingApi';
import {getSeekerSessions} from '../api/seekerApi';

export const createBooking = async (booking: {
  profile_slug?: string;
  mentor?: {id?: string; name?: string};
  date?: string;
  time?: string;
  notes?: string;
}) => {
  try {
    const slug = booking.profile_slug || booking.mentor?.name?.toLowerCase().replace(/\s+/g, '-') || 'mentor';
    const res = await apiCreateBooking({
      profile_slug: slug,
      session_date: booking.date || new Date().toISOString().split('T')[0],
      time_slot_id: 1,
      duration_minutes: 30,
      notes: booking.notes,
    });
    return res.data;
  } catch (error) {
    // Return booking structure with generated id if backend offline
    return {
      ...booking,
      id: String(Date.now()),
      status: 'upcoming',
    };
  }
};

export const getBookings = async () => {
  try {
    const res = await getSeekerSessions();
    return res.data?.data || res.data || [];
  } catch (error) {
    return [];
  }
};

export const cancelBooking = async (bookingId: string | number, reason?: string) => {
  try {
    const res = await apiCancelBooking({booking_id: bookingId, reason});
    return res.data;
  } catch (error) {
    return true;
  }
};
