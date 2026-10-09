import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import CheckIcon from '../common/CheckIcon';

const ALL_SLOTS = [
  {id: '1', time: '09:00 AM', period: 'Morning'},
  {id: '2', time: '10:30 AM', period: 'Morning'},
  {id: '3', time: '11:45 AM', period: 'Morning'},
  {id: '4', time: '02:00 PM', period: 'Afternoon'},
  {id: '5', time: '03:30 PM', period: 'Afternoon'},
  {id: '6', time: '04:45 PM', period: 'Afternoon'},
  {id: '7', time: '06:00 PM', period: 'Evening'},
  {id: '8', time: '07:15 PM', period: 'Evening'},
  {id: '9', time: '08:30 PM', period: 'Evening'},
];

const PERIOD_TABS = ['All', 'Morning', 'Afternoon', 'Evening'] as const;

export interface TimePickerProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  availableTimes?: string[];
}

export default function TimePicker({
  selectedTime,
  onSelectTime,
  availableTimes,
}: TimePickerProps) {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState<typeof PERIOD_TABS[number]>('All');

  const slots = availableTimes && availableTimes.length > 0
    ? availableTimes.map((t, idx) => ({
        id: String(idx),
        time: t,
        period: t.includes('AM') ? 'Morning' : parseInt(t, 10) < 6 ? 'Afternoon' : 'Evening',
      }))
    : ALL_SLOTS;

  const filteredSlots =
    activeTab === 'All'
      ? slots
      : slots.filter(s => s.period === activeTab);

  return (
    <View style={styles.container}>
      {/* Period Filter Tabs */}
      <View
        style={[
          styles.tabBar,
          {backgroundColor: theme.colors.surfaceMuted},
        ]}>
        {PERIOD_TABS.map(tab => {
          const isCurrent = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                isCurrent && {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.cardShadow,
                  elevation: 2,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isCurrent ? theme.colors.text : theme.colors.mutedText,
                    fontFamily: isCurrent ? theme.fonts.bold : theme.fonts.medium,
                  },
                ]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Grid of Time Slots */}
      <View style={styles.grid}>
        {filteredSlots.map(slot => {
          const isSelected = selectedTime === slot.time;
          return (
            <Pressable
              key={slot.id}
              onPress={() => onSelectTime(slot.time)}
              accessibilityRole="button"
              accessibilityLabel={`Select time slot ${slot.time}`}
              style={[
                styles.slotCard,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.slotText,
                  {
                    color: isSelected
                      ? theme.colors.onPrimary
                      : theme.colors.text,
                    fontFamily: isSelected
                      ? theme.fonts.bold
                      : theme.fonts.medium,
                  },
                ]}>
                {slot.time}
              </Text>
              {isSelected ? (
                <View style={styles.checkMark}>
                  <CheckIcon
                    size={11}
                    color={theme.colors.accent}
                    strokeWidth={2.6}
                  />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabText: {
    fontSize: 11.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  slotCard: {
    width: '31%',
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    position: 'relative',
  },
  slotText: {
    fontSize: 12.5,
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 6,
  },
});
