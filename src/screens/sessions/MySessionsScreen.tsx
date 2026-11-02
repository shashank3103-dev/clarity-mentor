import React, {useCallback, useState} from 'react';
import {View, Text, Pressable, StyleSheet, FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import ScreenState from '../../components/common/ScreenState';
import {useTheme} from '../../theme';
import CustomHeader from '../../components/common/CustomHeader';
import {getErrorMessage} from '../../services/api';
import {fetchSessions, isUpcoming, Session, statusColor} from '../../utils/session';
import {formatDateTime, imageUrl} from '../../utils/mentor';
import {initials} from '../../utils/helpers';

const LIMIT = 20;

export default function MySessionsScreen({navigation}: any) {
  const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const userType = useSelector((s: any) => s.auth.userType);
  const {theme} = useTheme();
  const isMentor = userType === 'mentor';

  const [items, setItems] = useState<Session[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage: number, mode: 'load' | 'refresh' | 'more') => {
      if (!userType) return;
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      try {
        const res = await fetchSessions(userType, nextPage, LIMIT);
        const data: Session[] = res?.data || [];
        setItems(prev => (nextPage === 1 ? data : [...prev, ...data]));
        setPage(nextPage);
        setTotalPages(res?.total_pages || 1);
        setError(null);
      } catch (e) {
        setError(getErrorMessage(e, 'Could not load sessions'));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [userType],
  );

  // Refresh whenever the tab comes into focus (e.g. after a booking / review).
  useFocusEffect(
    useCallback(() => {
      load(1, 'load');
    }, [load]),
  );

  const shown = items
    .filter(s => (tab === 'Upcoming' ? isUpcoming(s) : !isUpcoming(s)))
    .sort((a, b) =>
      tab === 'Upcoming'
        ? a.session_date_time.localeCompare(b.session_date_time)
        : b.session_date_time.localeCompare(a.session_date_time),
    );

  const renderItem = ({item: x}: {item: Session}) => {
    const name = (isMentor ? x.seeker_name : x.mentor_name) || 'Session';
    const image = isMentor ? x.seeker_image : x.mentor_image;
    return (
      <Pressable
        onPress={() => navigation.navigate('SessionDetails', {session: x})}
        style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
        <Avatar label={initials(name)} uri={imageUrl(image)} />
        <View style={styles.info}>
          <Text style={[styles.name, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>{name}</Text>
          {x.mentor_expertise && !isMentor ? (
            <Text
              numberOfLines={1}
              style={[styles.role, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
              {x.mentor_expertise}
            </Text>
          ) : null}
          <Text style={[styles.date, {color: theme.colors.secondary, fontFamily: theme.fonts.semiBold}]}>
            {formatDateTime(x.session_date_time)}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.duration, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
              {x.duration_minutes} minutes
            </Text>
            <Text
              style={[
                styles.badge,
                {
                  color: statusColor(x.status, theme.colors),
                  backgroundColor: theme.colors.surfaceMuted,
                  fontFamily: theme.fonts.bold,
                },
              ]}>
              {x.status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="My Sessions"
        showBack={navigation?.canGoBack?.()}
        onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined}
      />
      <View style={[styles.tabs, {backgroundColor: theme.colors.surfaceMuted, marginHorizontal: theme.spacing.lg}]}>
        {(['Upcoming', 'Past'] as const).map(x => (
          <Pressable
            key={x}
            onPress={() => setTab(x)}
            style={[
              styles.tab,
              tab === x && {backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow, elevation: 2},
            ]}>
            <Text
              style={[
                styles.tabText,
                {
                  color: tab === x ? theme.colors.text : theme.colors.mutedText,
                  fontFamily: tab === x ? theme.fonts.bold : theme.fonts.medium,
                },
              ]}>
              {x}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading || (error && !items.length) ? (
        <ScreenState loading={loading} error={error} onRetry={() => load(1, 'load')} />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={x => String(x.id)}
          renderItem={renderItem}
          contentContainerStyle={[styles.container, {paddingHorizontal: theme.spacing.lg}]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(1, 'refresh')} tintColor={theme.colors.secondary} />
          }
          onEndReached={() => !loadingMore && page < totalPages && load(page + 1, 'more')}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={theme.colors.secondary} /> : null}
          ListEmptyComponent={
            <EmptyState
              title={tab === 'Upcoming' ? 'No upcoming sessions' : 'No past sessions'}
              description={
                isMentor
                  ? 'Sessions booked by seekers will show up here.'
                  : "You don't have any mentoring sessions here yet."
              }
              actionTitle={isMentor ? undefined : 'Find a mentor'}
              action={isMentor ? undefined : () => navigation.navigate('Explore')}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  container: {paddingTop: 4, paddingBottom: 40, flexGrow: 1},
  tabs: {borderRadius: 14, padding: 4, flexDirection: 'row', marginTop: 16, marginBottom: 16},
  tab: {flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10},
  tabText: {fontSize: 14},
  card: {borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', marginBottom: 12, alignItems: 'center'},
  info: {marginLeft: 14, flex: 1},
  name: {fontSize: 16},
  role: {fontSize: 13, marginTop: 2},
  date: {fontSize: 14, marginTop: 10},
  metaRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4},
  duration: {fontSize: 12},
  badge: {fontSize: 10, letterSpacing: 0.6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden'},
});
