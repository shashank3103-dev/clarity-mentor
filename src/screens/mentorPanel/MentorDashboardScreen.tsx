import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import CustomHeader from '../../components/common/CustomHeader';
import AssetIcon from '../../components/common/AssetIcon';
import ScreenState from '../../components/common/ScreenState';
import Button from '../../components/common/Button';
import {useTheme} from '../../theme/useTheme';
import useAsync from '../../hooks/useAsync';
import {mentorService} from '../../services/mentorService';
import {isUpcoming, Session} from '../../utils/session';
import {formatDateTime} from '../../utils/mentor';

export default function MentorDashboardScreen({navigation}: any) {
  const {theme} = useTheme();
  const user = useSelector((s: any) => s.auth.user);

  const {data, loading, refreshing, error, reload, refresh, silentReload} = useAsync(async () => {
    const [dash, sessions] = await Promise.all([
      mentorService.getDashboard(),
      mentorService.getSessions(1, 20).catch(() => null),
    ]);
    const upcoming: Session[] = (sessions?.data || [])
      .filter(isUpcoming)
      .sort((a: Session, b: Session) => a.session_date_time.localeCompare(b.session_date_time))
      .slice(0, 3);
    return {dash: dash?.data, upcoming};
  }, []);

  useFocusEffect(
    useCallback(() => {
      silentReload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const d = data?.dash;
  const chart: any[] = d?.charts?.earnings_last_7_days || [];
  const max = Math.max(1, ...chart.map(x => Number(x.amount ?? x.earnings ?? x.total ?? 0)));

  const tiles = [
    ['Total earnings', `₹${d?.financials?.total_earnings || '0.00'}`],
    ['Last 7 days', `₹${d?.financials?.last_7_days_earnings || '0.00'}`],
    ['Sessions', d?.sessions?.total ?? 0],
    ['Upcoming', d?.sessions?.upcoming ?? 0],
    ['Completed', d?.sessions?.completed ?? 0],
    ['Hours', parseFloat(d?.sessions?.total_hours || '0').toFixed(1)],
    ['Avg rating', d?.quality?.average_rating || '—'],
    ['Reviews', d?.quality?.total_reviews ?? 0],
  ];

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title={`Hi, ${user?.full_name?.split(' ')[0] || 'Mentor'}`}
        subtitle="Your mentor dashboard"
        showBack={false}
        right={
          <Pressable onPress={() => navigation.openDrawer?.()} hitSlop={10} accessibilityLabel="Open menu">
            <AssetIcon name="hamburger" size={22} />
          </Pressable>
        }
      />
      {loading || (error && !data) ? (
        <ScreenState loading={loading} error={error} onRetry={reload} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.colors.secondary} />}>
          {user?.status && user.status !== 'approved' ? (
            <View style={[styles.banner, {backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.warning}]}>
              <Text style={{color: theme.colors.warning, fontFamily: theme.fonts.bold, fontSize: 13}}>
                Profile {String(user.status)}
              </Text>
              <Text style={{color: theme.colors.text, fontFamily: theme.fonts.regular, fontSize: 12.5, marginTop: 4}}>
                Complete your profile and availability. Seekers can book you once your profile is approved.
              </Text>
            </View>
          ) : null}

          <View style={styles.grid}>
            {tiles.map(([label, value]) => (
              <View
                key={label as string}
                style={[styles.tile, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
                <Text style={{fontSize: 18, color: theme.colors.text, fontFamily: theme.fonts.bold}}>{value}</Text>
                <Text style={{fontSize: 11.5, color: theme.colors.mutedText, fontFamily: theme.fonts.medium, marginTop: 2}}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {chart.length ? (
            <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
              <Text style={[styles.cardTitle, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
                Earnings · last 7 days
              </Text>
              <View style={styles.chart}>
                {chart.map((x, i) => {
                  const v = Number(x.amount ?? x.earnings ?? x.total ?? 0);
                  const label = String(x.date || x.day || '').slice(-5);
                  return (
                    <View key={i} style={styles.barCol}>
                      <Text style={{fontSize: 9, color: theme.colors.mutedText, fontFamily: theme.fonts.medium}}>
                        {v ? `₹${Math.round(v)}` : ''}
                      </Text>
                      <View
                        style={[
                          styles.bar,
                          {height: Math.max(4, (v / max) * 110), backgroundColor: theme.colors.secondary},
                        ]}
                      />
                      <Text style={{fontSize: 9.5, color: theme.colors.mutedText, fontFamily: theme.fonts.regular}}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <Text style={[styles.cardTitle, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
              Upcoming sessions
            </Text>
            {data?.upcoming?.length ? (
              data.upcoming.map(s => (
                <Pressable
                  key={s.id}
                  onPress={() => navigation.navigate('SessionDetails', {session: s})}
                  style={[styles.sessionRow, {borderColor: theme.colors.border}]}>
                  <Text style={{color: theme.colors.text, fontFamily: theme.fonts.semiBold, fontSize: 14}}>
                    {s.seeker_name || 'Seeker'}
                  </Text>
                  <Text style={{color: theme.colors.secondary, fontFamily: theme.fonts.medium, fontSize: 12.5}}>
                    {formatDateTime(s.session_date_time)} · {s.duration_minutes} min
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={{color: theme.colors.mutedText, fontFamily: theme.fonts.regular, fontSize: 13}}>
                No upcoming sessions yet.
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <Button title="Availability" variant="secondary" height={44} onPress={() => navigation.navigate('Availability')} style={{flex: 1}} />
            <Button title="Edit profile" variant="outline" height={44} onPress={() => navigation.navigate('EditProfile')} style={{flex: 1}} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {padding: 20, paddingBottom: 48},
  banner: {borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10},
  tile: {width: '48.5%', borderWidth: 1, borderRadius: 16, padding: 14},
  card: {borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 16},
  cardTitle: {fontSize: 15, marginBottom: 12},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150},
  barCol: {flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4},
  bar: {width: 16, borderRadius: 6},
  sessionRow: {paddingVertical: 10, borderBottomWidth: 0.5, gap: 2},
  actions: {flexDirection: 'row', gap: 10, marginTop: 18},
});
