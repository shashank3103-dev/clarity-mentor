import React, {useMemo} from 'react';
import {View, Text, FlatList, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DateSelector from '../../components/booking/DateSelector';
import DatePicker from '../../components/booking/DatePicker';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import ScreenState from '../../components/common/ScreenState';
import EmptyState from '../../components/common/EmptyState';
import {setDate} from '../../redux/slices/bookingSlice';
import {useTheme} from '../../theme/useTheme';
import {mentorService} from '../../services/mentorService';
import {buildAvailableDays, formatLongDate} from '../../utils/mentor';
import useAsync from '../../hooks/useAsync';

const DAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function SelectDateScreen({navigation}: any) {
  const {theme} = useTheme();
  const {date, mentor} = useSelector((s: any) => s.booking);
  const dispatch = useDispatch();

  // Re-fetched every time, like the web booking modal, so slots are never stale.
  const {data, loading, error, reload} = useAsync(
    async () => (await mentorService.getAvailability(mentor.slug))?.data,
    [mentor?.slug],
    !!mentor?.slug,
  );
  const days = useMemo(() => buildAvailableDays(data), [data]);
  const quickDates = days.slice(0, 10).map(d => {
    const dt = new Date(`${d.date}T00:00:00`);
    return {
      iso: d.date,
      day: DAY[dt.getDay()],
      num: String(dt.getDate()),
      month: MON[dt.getMonth()],
    };
  });

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Select Date"
        subtitle={mentor ? `Session with ${mentor.name}` : undefined}
        onBack={() => navigation.goBack()}
      />
      {loading || error ? (
        <ScreenState loading={loading} error={error} onRetry={reload} />
      ) : !days.length ? (
        <EmptyState
          title="No available dates"
          description="This mentor has no open slots right now. Send them a message to find a time."
          actionTitle="Go back"
          action={() => navigation.goBack()}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, {paddingHorizontal: theme.spacing.lg}]}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.step, {color: theme.colors.secondary, fontFamily: theme.fonts.bold}]}>
            STEP 1 OF 3
          </Text>
          <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            Choose a date
          </Text>
          <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
            Only days with open slots can be selected.
          </Text>

          <Text style={[styles.sectionLabel, {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold}]}>
            QUICK SELECT
          </Text>
          <FlatList
            horizontal
            data={quickDates}
            keyExtractor={x => x.iso}
            renderItem={({item}) => (
              <DateSelector
                date={item}
                selected={date === item.iso}
                onPress={() => dispatch(setDate(item.iso))}
              />
            )}
            showsHorizontalScrollIndicator={false}
            style={styles.dates}
            contentContainerStyle={styles.datesContent}
          />

          <Text style={[styles.sectionLabel, {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold}]}>
            CALENDAR
          </Text>
          <DatePicker
            selectedDate={date}
            availableDates={days.map(d => d.date)}
            onSelectDate={d => dispatch(setDate(d))}
          />

          {date ? (
            <View
              style={[
                styles.selectedBanner,
                {backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border},
              ]}>
              <Text style={[styles.selectedText, {color: theme.colors.text, fontFamily: theme.fonts.medium}]}>
                Selected: <Text style={{fontFamily: theme.fonts.bold}}>{formatLongDate(date)}</Text>
              </Text>
            </View>
          ) : null}

          <Button
            title="Choose a time"
            onPress={() => navigation.navigate('SelectTime', {days})}
            disabled={!date}
            style={styles.actionBtn}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {paddingTop: 12, paddingBottom: 40},
  step: {fontSize: 10, letterSpacing: 1.1, marginTop: 8},
  title: {fontSize: 22, marginTop: 6},
  body: {fontSize: 13, lineHeight: 18, marginTop: 4},
  sectionLabel: {fontSize: 10, letterSpacing: 1.1, marginTop: 18, marginBottom: 8},
  dates: {marginBottom: 8},
  datesContent: {paddingVertical: 6, paddingRight: 10},
  selectedBanner: {padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 8, alignItems: 'center'},
  selectedText: {fontSize: 13},
  actionBtn: {marginTop: 20, height: 48},
});
