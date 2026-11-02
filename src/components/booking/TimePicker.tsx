import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import CheckIcon from '../common/CheckIcon';
import {DaySlot, to12h} from '../../utils/mentor';

const PERIOD_TABS = ['All', 'Morning', 'Afternoon', 'Evening'] as const;

export interface TimePickerProps {
  slots: DaySlot[];
  selectedId?: number | null;
  onSelect: (slot: DaySlot) => void;
}

const periodOf = (start: string) => {
  const h = parseInt(start, 10) || 0;
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
};

export default function TimePicker({slots, selectedId, onSelect}: TimePickerProps) {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState<typeof PERIOD_TABS[number]>('All');

  const filteredSlots =
    activeTab === 'All' ? slots : slots.filter(s => periodOf(s.start) === activeTab);

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

      {!filteredSlots.length ? (
        <Text style={{color: theme.colors.mutedText, fontFamily: theme.fonts.regular, fontSize: 13}}>
          No {activeTab.toLowerCase()} slots on this day.
        </Text>
      ) : null}
      {/* Grid of Time Slots */}
      <View style={styles.grid}>
        {filteredSlots.map(slot => {
          const isSelected = selectedId === slot.id;
          return (
            <Pressable
              key={slot.id}
              onPress={() => onSelect(slot)}
              accessibilityRole="button"
              accessibilityLabel={`Select time slot ${slot.label}`}
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
                {to12h(slot.start)}
              </Text>
              <Text
                style={{
                  fontSize: 10.5,
                  marginTop: 2,
                  color: isSelected ? theme.colors.onPrimary : theme.colors.mutedText,
                  fontFamily: theme.fonts.regular,
                }}>
                to {to12h(slot.end)}
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
