import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';
import {seekerService} from '../../services/seekerService';
import {getErrorMessage} from '../../services/api';
import {formatDateTime} from '../../utils/mentor';
import {canJoin, joinSession, markSessionComplete, Session, statusColor} from '../../utils/session';

export default function SessionDetailsScreen({route, navigation}: any) {
  const {theme} = useTheme();
  const userType = useSelector((st: any) => st.auth.userType);
  const isMentor = userType === 'mentor';
  const [s, setS] = useState<Session>(route.params?.session);
  const [joining, setJoining] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!s) return null;

  const counterpart = isMentor ? s.seeker_name : s.mentor_name;
  const showMarkComplete = s.can_mark_complete === 1 && s.status !== 'completed';
  const canReview = !isMentor && s.review_status === 'allowed' && s.has_success_payment === 1;

  const join = async () => {
    setJoining(true);
    await joinSession(s);
    setJoining(false);
  };

  const complete = async () => {
    setCompleting(true);
    try {
      await markSessionComplete(userType, s.id);
      setS({...s, status: 'completed', can_mark_complete: 0});
      Alert.alert('Done', 'Session marked as complete.');
    } catch (e) {
      Alert.alert('Failed', getErrorMessage(e, 'Failed to mark session complete. Please try again.'));
    } finally {
      setCompleting(false);
    }
  };

  const submitReview = async () => {
    if (!rating) return Alert.alert('Add a rating', 'Please choose 1 to 5 stars.');
    setSubmitting(true);
    try {
      await seekerService.addReview(s.id, rating, review.trim());
      setS({...s, review_status: 'completed', rating, review});
      Alert.alert('Thank you!', 'Your review was submitted.');
    } catch (e) {
      Alert.alert('Failed', getErrorMessage(e, 'Could not submit review.'));
    } finally {
      setSubmitting(false);
    }
  };

  const Label = ({children}: any) => (
    <Text style={[styles.label, {color: theme.colors.secondary, fontFamily: theme.fonts.bold}]}>{children}</Text>
  );
  const Value = ({children, muted}: any) => (
    <Text
      style={[
        styles.value,
        {
          color: muted ? theme.colors.mutedText : theme.colors.text,
          fontFamily: muted ? theme.fonts.regular : theme.fonts.semiBold,
        },
      ]}>
      {children}
    </Text>
  );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Session Details" onBack={() => navigation?.goBack?.()} />
      <ScrollView contentContainerStyle={{padding: theme.spacing.lg, paddingBottom: 48}} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          {counterpart || 'Your session'}
        </Text>
        {!isMentor && s.mentor_expertise ? (
          <Text style={[styles.role, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
            {s.mentor_expertise}
          </Text>
        ) : null}

        <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <Label>STATUS</Label>
          <Text style={[styles.value, {color: statusColor(s.status, theme.colors), fontFamily: theme.fonts.bold}]}>
            {s.status?.toUpperCase()}
          </Text>
          <Label>WHEN</Label>
          <Value>{formatDateTime(s.session_date_time)}</Value>
          <Label>DURATION</Label>
          <Value>{s.duration_minutes} minutes</Value>
          {s.notes ? (
            <>
              <Label>NOTES</Label>
              <Value muted>{s.notes}</Value>
            </>
          ) : null}
          {!isMentor && s.has_success_payment !== undefined ? (
            <>
              <Label>PAYMENT</Label>
              <Value muted>{s.has_success_payment === 1 ? 'Paid' : 'Pending'}</Value>
            </>
          ) : null}
          <Label>PRIVATE SESSION</Label>
          <Value muted>
            {canJoin(s)
              ? 'Tap "Join session" at the scheduled time to open the private video call.'
              : 'The meeting link is available for confirmed upcoming sessions.'}
          </Value>
        </View>

        {canJoin(s) ? <Button title="Join session" onPress={join} loading={joining} /> : null}
        {showMarkComplete ? (
          <Button
            title="Mark as complete"
            variant="outline"
            onPress={complete}
            loading={completing}
            style={{marginTop: 12}}
          />
        ) : null}
        {s.conversation_id ? (
          <Button
            title="Open chat"
            variant="soft"
            onPress={() =>
              navigation.navigate('Chat', {conversationId: s.conversation_id, name: counterpart})
            }
            style={{marginTop: 12}}
          />
        ) : null}

        {s.review ? (
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <Label>YOUR REVIEW</Label>
            <Text style={{color: theme.colors.star, fontSize: 18, marginTop: 4}}>
              {'★'.repeat(Number(s.rating) || 0).padEnd(5, '☆')}
            </Text>
            <Value muted>{s.review}</Value>
          </View>
        ) : canReview ? (
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <Label>RATE YOUR SESSION</Label>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(n => (
                <Pressable key={n} onPress={() => setRating(n)} hitSlop={6} accessibilityLabel={`${n} stars`}>
                  <Text style={{fontSize: 30, color: n <= rating ? theme.colors.star : theme.colors.border}}>★</Text>
                </Pressable>
              ))}
            </View>
            <Input value={review} onChangeText={setReview} placeholder="How did the session help you?" multiline />
            <Button title="Submit review" onPress={submitReview} loading={submitting} height={46} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  title: {fontSize: 26, marginTop: 8},
  role: {marginTop: 4, fontSize: 14},
  card: {padding: 20, borderRadius: 18, borderWidth: 1, marginVertical: 20},
  label: {fontSize: 11, letterSpacing: 1.2, marginTop: 14},
  value: {fontSize: 15, lineHeight: 22, marginTop: 4},
  stars: {flexDirection: 'row', gap: 6, marginVertical: 10},
});
