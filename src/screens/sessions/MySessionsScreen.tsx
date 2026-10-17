import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme';
import {getSeekerSessions} from '../../api/seekerApi';
import {setSessions} from '../../redux/slices/sessionSlice';

export default function MySessionsScreen({navigation}: any) {
  const [tab, setTab] = useState<'Upcoming' | 'Completed'>('Upcoming');
  const items = useSelector((s: any) => s.sessions.items);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const {theme} = useTheme();

  const fetchSessions = useCallback(async () => {
    try {
      setError(null);
      const res = await getSeekerSessions({page: 1, limit: 20});
      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.sessions)
        ? data.sessions
        : null;

      if (list && list.length > 0) {
        const formatted = list.map((item: any) => ({
          id: String(item.id || item.session_id || Date.now()),
          mentor: {
            name: item.mentor_name || item.mentor?.name || 'Clarity Mentor',
            role: item.mentor_role || item.mentor?.role || 'Mentor',
            image: item.mentor?.image || item.mentor_avatar || 'CM',
          },
          date: item.session_date || item.date || 'Upcoming',
          time: item.time_slot || item.time || '10:00 AM',
          duration: item.duration_minutes || 30,
          status: item.status === 'completed' ? 'completed' : 'upcoming',
        }));
        dispatch(setSessions(formatted));
      }
    } catch (err: any) {
      console.log('[MySessionsScreen] fetchSessions error:', err);
      // Keep existing sessions if API is not reachable
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  };

  const filtered = items.filter(
    (x: any) => x.status === (tab === 'Upcoming' ? 'upcoming' : 'completed'),
  );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="My Sessions"
        showBack={navigation?.canGoBack?.()}
        onBack={
          navigation?.canGoBack?.() ? () => navigation.goBack() : undefined
        }
      />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {paddingHorizontal: theme.spacing.lg},
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secondary}
            colors={[theme.colors.secondary]}
          />
        }>
        <View
          style={[
            styles.tabs,
            {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          {(['Upcoming', 'Completed'] as const).map(x => (
            <Pressable
              key={x}
              onPress={() => setTab(x)}
              style={[
                styles.tab,
                tab === x && {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.cardShadow,
                  elevation: 2,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      tab === x ? theme.colors.text : theme.colors.mutedText,
                    fontFamily:
                      tab === x ? theme.fonts.bold : theme.fonts.medium,
                  },
                ]}>
                {x}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <ErrorMessage message={error} />
            <Button
              title="Try Again"
              variant="outline"
              height={40}
              onPress={fetchSessions}
              style={{marginTop: 8, alignSelf: 'center'}}
            />
          </View>
        ) : null}

        {loading && !refreshing ? (
          <LoadingIndicator fullScreen={false} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={
              tab === 'Upcoming'
                ? 'No upcoming sessions'
                : 'No completed sessions'
            }
            description={
              tab === 'Upcoming'
                ? "You don't have any upcoming mentoring sessions yet. Browse our verified mentors to book your first call."
                : 'Your session history will appear here once you complete a 1-on-1 session.'
            }
            actionTitle={tab === 'Upcoming' ? 'Find a mentor' : undefined}
            action={
              tab === 'Upcoming'
                ? () => navigation.navigate('Explore')
                : undefined
            }
          />
        ) : (
          filtered.map((x: any) => (
            <Pressable
              key={x.id}
              onPress={() =>
                navigation.navigate('SessionDetails', {session: x})
              }
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Avatar label={x.mentor?.image || 'CM'} />
              <View style={styles.info}>
                <Text
                  style={[
                    styles.name,
                    {color: theme.colors.text, fontFamily: theme.fonts.bold},
                  ]}>
                  {x.mentor?.name || 'Clarity Mentor'}
                </Text>
                <Text
                  style={[
                    styles.role,
                    {
                      color: theme.colors.mutedText,
                      fontFamily: theme.fonts.regular,
                    },
                  ]}>
                  {x.mentor?.role || 'Mentor'}
                </Text>
                <Text
                  style={[
                    styles.date,
                    {
                      color: theme.colors.secondary,
                      fontFamily: theme.fonts.semiBold,
                    },
                  ]}>
                  {x.date} · {x.time}
                </Text>
                <Text
                  style={[
                    styles.duration,
                    {
                      color: theme.colors.mutedText,
                      fontFamily: theme.fonts.regular,
                    },
                  ]}>
                  {x.duration || 30} minutes
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  container: {paddingTop: 16, paddingBottom: 40},
  tabs: {
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
  },
  errorBox: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  info: {marginLeft: 14, flex: 1},
  name: {fontSize: 16},
  role: {fontSize: 13, marginTop: 2},
  date: {fontSize: 14, marginTop: 10},
  duration: {fontSize: 12, marginTop: 2},
});
