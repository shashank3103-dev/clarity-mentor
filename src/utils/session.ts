import {Alert, Linking} from 'react-native';
import {bookingService} from '../services/bookingService';
import {mentorService} from '../services/mentorService';
import {seekerService} from '../services/seekerService';
import {getErrorMessage} from '../services/api';

export type Session = {
  id: number;
  conversation_id?: string;
  session_date_time: string;
  duration_minutes: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | string;
  notes?: string;
  meet_id?: string;
  mentor_name?: string;
  mentor_image?: string;
  mentor_expertise?: string;
  seeker_name?: string;
  seeker_image?: string;
  rating?: number | null;
  review?: string | null;
  has_success_payment?: 0 | 1;
  is_payment_released?: 0 | 1;
  can_mark_complete?: 0 | 1;
  review_status?: 'allowed' | 'session_not_confirmed' | 'pending' | 'completed' | string;
  [key: string]: any;
};

export const sessionStart = (s: Session) => new Date(s.session_date_time);
export const sessionEnd = (s: Session) =>
  new Date(sessionStart(s).getTime() + (s.duration_minutes || 30) * 60000);

// Web treats a session as expired 30 minutes after it ends.
export const isExpired = (s: Session) => sessionEnd(s).getTime() < Date.now() - 30 * 60000;

export const isUpcoming = (s: Session) =>
  (s.status === 'confirmed' || s.status === 'pending') && !isExpired(s);

export const canJoin = (s: Session) =>
  s.status === 'confirmed' && !!s.meet_id && !isExpired(s);

export const fetchSessions = (userType: string, page: number, limit = 10) =>
  userType === 'mentor'
    ? mentorService.getSessions(page, limit)
    : seekerService.getSessions(page, limit);

export const markSessionComplete = (userType: string, id: number) =>
  userType === 'mentor'
    ? mentorService.markSessionComplete(id)
    : seekerService.markSessionComplete(id);

/** Resolves the Jitsi meeting URL via the backend and opens it. */
export async function joinSession(s: Session) {
  if (!s.meet_id) return;
  try {
    const res = await bookingService.getMeetLink(s.meet_id);
    if (res?.join_allowed === false || !res?.meeting_url) {
      Alert.alert('Not yet', res?.message || 'This session cannot be joined right now.');
      return;
    }
    await Linking.openURL(res.meeting_url);
  } catch (e) {
    Alert.alert('Could not join', getErrorMessage(e, 'Failed to get meeting link.'));
  }
}

export const statusColor = (status: string, colors: any) =>
  status === 'confirmed'
    ? colors.success
    : status === 'completed'
    ? colors.secondary
    : status === 'cancelled'
    ? colors.error
    : colors.warning;
