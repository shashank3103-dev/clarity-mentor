import React from 'react';
import {View, Text, FlatList, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DateSelector from '../../components/booking/DateSelector';
import DatePicker from '../../components/booking/DatePicker';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {setDate} from '../../redux/slices/bookingSlice';
import {useTheme} from '../../theme/useTheme';

const QUICK_DATES = [
  {day: 'SUN', num: '18', month: 'OCT', full: '18 October 2026'},
  {day: 'MON', num: '19', month: 'OCT', full: '19 October 2026'},
  {day: 'TUE', num: '20', month: 'OCT', full: '20 October 2026'},
  {day: 'WED', num: '21', month: 'OCT', full: '21 October 2026'},
  {day: 'THU', num: '22', month: 'OCT', full: '22 October 2026'},
  {day: 'FRI', num: '23', month: 'OCT', full: '23 October 2026'},
];

export default function SelectDateScreen({navigation}: any) {
  const {theme} = useTheme();
  const date = useSelector((s: any) => s.booking.date);
  const dispatch = useDispatch();

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Select Date"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingHorizontal: theme.spacing.lg},
        ]}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.step,
            {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
          ]}>
          STEP 1 OF 3
        </Text>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          Choose a date
        </Text>
        <Text
          style={[
            styles.body,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          Select a day that works best for your 1-on-1 clarity call.
        </Text>

        {/* Quick Dates Strip */}
        <Text
          style={[
            styles.sectionLabel,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold},
          ]}>
          QUICK SELECT
        </Text>
        <FlatList
          horizontal
          data={QUICK_DATES}
          keyExtractor={x => x.full}
          renderItem={({item}) => (
            <DateSelector
              date={item}
              selected={date === item.full}
              onPress={() => dispatch(setDate(item.full))}
            />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.dates}
          contentContainerStyle={styles.datesContent}
        />

        {/* Full Interactive Month Calendar DatePicker */}
        <Text
          style={[
            styles.sectionLabel,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold},
          ]}>
          CALENDAR
        </Text>
        <DatePicker
          selectedDate={date}
          onSelectDate={d => dispatch(setDate(d))}
        />

        {date ? (
          <View
            style={[
              styles.selectedBanner,
              {
                backgroundColor: theme.colors.surfaceMuted,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text
              style={[
                styles.selectedText,
                {color: theme.colors.text, fontFamily: theme.fonts.medium},
              ]}>
              Selected: <Text style={{fontFamily: theme.fonts.bold}}>{date}</Text>
            </Text>
          </View>
        ) : null}

        <Button
          title="Choose a time"
          onPress={() => navigation.navigate('SelectTime')}
          disabled={!date}
          style={styles.actionBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  step: {
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    marginTop: 6,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: 18,
    marginBottom: 8,
  },
  dates: {
    marginBottom: 8,
  },
  datesContent: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  selectedBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 13,
  },
  actionBtn: {
    marginTop: 20,
    height: 48,
  },
});
