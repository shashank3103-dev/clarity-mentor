import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import {useTheme} from '../../theme/useTheme';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface DatePickerProps {
  selectedDate: string; // e.g. "20 October 2026"
  onSelectDate: (date: string) => void;
}

export default function DatePicker({
  selectedDate,
  onSelectDate,
}: DatePickerProps) {
  const {theme} = useTheme();

  // Default to October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed, 9 = October

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Build grid
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const isSelected = (day: number) => {
    const formatted = `${day} ${MONTH_NAMES[currentMonth]} ${currentYear}`;
    return selectedDate === formatted;
  };

  const handlePick = (day: number) => {
    const formatted = `${day} ${MONTH_NAMES[currentMonth]} ${currentYear}`;
    onSelectDate(formatted);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <Pressable
          onPress={prevMonth}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          style={[
            styles.navBtn,
            {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          <Image
            source={require('../../assets/icons/tabs/chevron-right.png')}
            style={[
              styles.navIcon,
              {tintColor: theme.colors.text, transform: [{rotate: '180deg'}]},
            ]}
            resizeMode="contain"
          />
        </Pressable>

        <Text
          style={[
            styles.monthTitle,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>

        <Pressable
          onPress={nextMonth}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          style={[
            styles.navBtn,
            {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          <Image
            source={require('../../assets/icons/tabs/chevron-right.png')}
            style={[styles.navIcon, {tintColor: theme.colors.text}]}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekRow}>
        {DAYS_OF_WEEK.map((w, idx) => (
          <Text
            key={idx}
            style={[
              styles.weekCell,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold},
            ]}>
            {w}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {days.map((day, idx) => {
          if (day === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }

          const active = isSelected(day);

          return (
            <Pressable
              key={`day-${day}`}
              onPress={() => handlePick(day)}
              style={[
                styles.dayCell,
                active && [
                  styles.activeDay,
                  {backgroundColor: theme.colors.primary},
                ],
              ]}>
              <Text
                style={[
                  styles.dayNum,
                  {
                    color: active ? theme.colors.onPrimary : theme.colors.text,
                    fontFamily: active ? theme.fonts.bold : theme.fonts.regular,
                  },
                ]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthTitle: {
    fontSize: 15,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 13,
    height: 13,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  weekCell: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  activeDay: {
    elevation: 2,
  },
  dayNum: {
    fontSize: 13,
  },
});
