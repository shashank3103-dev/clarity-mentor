import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Linking, Alert, ScrollView} from 'react-native';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import ErrorMessage from '../../components/common/ErrorMessage';
import {useTheme} from '../../theme/useTheme';
import {getMeetingLink, markSessionCompleteBySeeker} from '../../api/seekerApi';
import {showError, showInfo} from '../../utils/appFeedback';

export default function SessionDetailsScreen({route, navigation}: any) {
  const {theme} = useTheme();
  const s = route.params?.session;

  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [loadingMeet, setLoadingMeet] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(s?.status === 'completed');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (s?.id) {
      getMeetingLink(s.id)
        .then(res => {
          const url =
            res.data?.meet_link ||
            res.data?.link ||
            res.data?.url ||
            res.data?.data?.meet_link;
          if (url) setMeetingUrl(url);
        })
        .catch(() => {});
    }
  }, [s?.id]);

  const handleJoin = async () => {
    if (meetingUrl) {
      Linking.openURL(meetingUrl).catch(() => {
        showError('Unable to open meeting link.', 'Link Error');
      });
    } else {
      setLoadingMeet(true);
      try {
        const res = await getMeetingLink(s?.id || '1');
        const url =
          res.data?.meet_link ||
          res.data?.link ||
          res.data?.url ||
          'https://meet.google.com';
        setMeetingUrl(url);
        Linking.openURL(url);
      } catch (err: any) {
        showInfo(
          'Meeting link will become active 10 minutes prior to your scheduled session.',
          'Meeting Room',
        );
      } finally {
        setLoadingMeet(false);
      }
    }
  };

  const handleMarkComplete = async () => {
    if (markingComplete) return;
    setMarkingComplete(true);
    setError(null);

    try {
      await markSessionCompleteBySeeker(s?.id || '1');
      setIsCompleted(true);
      Alert.alert(
        'Session Completed',
        'Thank you! How was your experience? Would you like to leave a review for your mentor?',
        [
          {text: 'Not Now', style: 'cancel'},
          {
            text: 'Leave Review',
            onPress: () =>
              navigation.navigate('MentorReviews', {
                session_id: s?.id,
                mentor: s?.mentor,
              }),
          },
        ],
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to mark session as complete.');
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Session Details"
        onBack={() => navigation?.goBack?.()}
      />
      <ScrollView
        contentContainerStyle={{padding: theme.spacing.lg}}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {s?.mentor?.name || 'Your session'}
        </Text>
        <Text
          style={[
            styles.role,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          {s?.mentor?.role || 'Mentor'}
        </Text>

        {error ? <ErrorMessage message={error} /> : null}

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            WHEN
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            {s?.date} · {s?.time}
          </Text>

          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            DURATION
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
            ]}>
            {s?.duration || 30} minutes
          </Text>

          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            STATUS
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: isCompleted
                  ? theme.colors.secondary
                  : theme.colors.text,
                fontFamily: theme.fonts.semiBold,
              },
            ]}>
            {isCompleted ? 'Completed' : 'Upcoming'}
          </Text>

          <Text
            style={[
              styles.label,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            PRIVATE MEETING LINK
          </Text>
          <Text
            style={[
              styles.value,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {meetingUrl
              ? meetingUrl
              : 'Your secure Google Meet link is generated automatically.'}
          </Text>
        </View>

        {!isCompleted ? (
          <>
            <Button
              title="Join session"
              onPress={handleJoin}
              loading={loadingMeet}
              style={{marginBottom: 12}}
            />
            <Button
              title="Mark session as complete"
              variant="outline"
              loading={markingComplete}
              onPress={handleMarkComplete}
            />
          </>
        ) : (
          <Button
            title="Leave a review"
            onPress={() =>
              navigation.navigate('MentorReviews', {
                session_id: s?.id,
                mentor: s?.mentor,
              })
            }
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    marginTop: 16,
  },
  role: {
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 20,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 14,
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
});
