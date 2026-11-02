import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Pressable, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import CustomHeader from '../../components/common/CustomHeader';
import ScreenState from '../../components/common/ScreenState';
import Button from '../../components/common/Button';
import {useTheme} from '../../theme/useTheme';
import useAsync from '../../hooks/useAsync';
import {mentorService} from '../../services/mentorService';
import {getErrorMessage} from '../../services/api';
import {to12h} from '../../utils/mentor';

// API weekday numbering: 1 = Monday ... 7 = Sunday.
const DAYS = [
  [1, 'Mon'],
  [2, 'Tue'],
  [3, 'Wed'],
  [4, 'Thu'],
  [5, 'Fri'],
  [6, 'Sat'],
  [7, 'Sun'],
] as const;
const SLOT_MINUTES = 30; // web adds fixed 30-minute slots
const pad = (n: number) => String(n).padStart(2, '0');

type Slot = {start_time: string; end_time: string};

const endOf = (h: number, m: number) => {
  const total = h * 60 + m + SLOT_MINUTES;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
};

export default function AvailabilityScreen({navigation}: any) {
  const {theme} = useTheme();
  const slug = useSelector((s: any) => s.auth.user?.profile_slug);
  const [days, setDays] = useState<number[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [saving, setSaving] = useState(false);

  const {data, loading, error, reload} = useAsync(
    async () => (await mentorService.getAvailability(slug))?.data || null,
    [slug],
    !!slug,
  );

  useEffect(() => {
    if (data) {
      setDays(data.selected_days || []);
      setSlots(
        (data.slots || []).map((s: any) => ({
          start_time: s.start_time.slice(0, 5),
          end_time: s.end_time.slice(0, 5),
        })),
      );
    }
  }, [data]);

  const toggleDay = (d: number) =>
    setDays(prev => (prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort()));

  const addSlot = () => {
    const start_time = `${pad(hour)}:${pad(minute)}`;
    if (slots.some(s => s.start_time === start_time)) {
      Alert.alert('Duplicate slot', 'A slot with this start time already exists.');
      return;
    }
    setSlots(prev =>
      [...prev, {start_time, end_time: endOf(hour, minute)}].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    );
  };

  const save = async () => {
    if (!days.length) return Alert.alert('Select days', 'Please select at least one day.');
    if (!slots.length) return Alert.alert('Add slots', 'Please add at least one time slot.');
    setSaving(true);
    try {
      await mentorService.updateAvailability({schedule_type: 'custom', selected_days: days, slots});
      Alert.alert('Saved', 'Availability updated successfully!');
    } catch (e) {
      Alert.alert('Could not save', getErrorMessage(e, 'Failed to update availability'));
    } finally {
      setSaving(false);
    }
  };

  const Stepper = ({value, onChange, step, max, label}: any) => (
    <View style={styles.stepper}>
      <Text style={[styles.stepLabel, {color: theme.colors.mutedText, fontFamily: theme.fonts.semiBold}]}>{label}</Text>
      <View style={styles.stepRow}>
        <Pressable
          onPress={() => onChange((value - step + max) % max)}
          style={[styles.stepBtn, {backgroundColor: theme.colors.surfaceMuted}]}>
          <Text style={{color: theme.colors.text, fontSize: 18, fontFamily: theme.fonts.bold}}>−</Text>
        </Pressable>
        <Text style={{color: theme.colors.text, fontSize: 18, fontFamily: theme.fonts.bold, minWidth: 34, textAlign: 'center'}}>
          {pad(value)}
        </Text>
        <Pressable
          onPress={() => onChange((value + step) % max)}
          style={[styles.stepBtn, {backgroundColor: theme.colors.surfaceMuted}]}>
          <Text style={{color: theme.colors.text, fontSize: 18, fontFamily: theme.fonts.bold}}>+</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Availability" onBack={() => navigation.goBack()} />
      {loading || error ? (
        <ScreenState loading={loading} error={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.section, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>Available days</Text>
          <View style={styles.days}>
            {DAYS.map(([n, label]) => {
              const on = days.includes(n);
              return (
                <Pressable
                  key={n}
                  onPress={() => toggleDay(n)}
                  style={[
                    styles.day,
                    {
                      backgroundColor: on ? theme.colors.primary : theme.colors.surface,
                      borderColor: on ? theme.colors.primary : theme.colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color: on ? theme.colors.onPrimary : theme.colors.text,
                      fontFamily: on ? theme.fonts.bold : theme.fonts.medium,
                      fontSize: 12.5,
                    }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.section, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            Add a {SLOT_MINUTES}-minute slot
          </Text>
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <View style={styles.pickers}>
              <Stepper label="HOUR" value={hour} onChange={setHour} step={1} max={24} />
              <Stepper label="MINUTE" value={minute} onChange={setMinute} step={15} max={60} />
            </View>
            <Text style={{color: theme.colors.mutedText, fontFamily: theme.fonts.regular, fontSize: 12.5, textAlign: 'center', marginTop: 10}}>
              {to12h(`${pad(hour)}:${pad(minute)}`)} – {to12h(endOf(hour, minute))}
            </Text>
            <Button title="Add slot" variant="soft" height={42} onPress={addSlot} style={{marginTop: 12}} />
          </View>

          <Text style={[styles.section, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
            Your slots ({slots.length})
          </Text>
          {!slots.length ? (
            <Text style={{color: theme.colors.mutedText, fontFamily: theme.fonts.regular, fontSize: 13}}>
              No slots yet. Add the times you're available.
            </Text>
          ) : null}
          {slots.map((s, i) => (
            <View
              key={s.start_time}
              style={[styles.slot, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
              <Text style={{color: theme.colors.text, fontFamily: theme.fonts.semiBold, fontSize: 14}}>
                {to12h(s.start_time)} – {to12h(s.end_time)}
              </Text>
              <Pressable onPress={() => setSlots(slots.filter((_, j) => j !== i))} hitSlop={8}>
                <Text style={{color: theme.colors.error, fontFamily: theme.fonts.bold, fontSize: 12.5}}>Remove</Text>
              </Pressable>
            </View>
          ))}

          <Button title="Save availability" onPress={save} loading={saving} style={{marginTop: 22}} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {padding: 20, paddingBottom: 48},
  section: {fontSize: 15, marginTop: 18, marginBottom: 10},
  days: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  day: {borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14},
  card: {borderWidth: 1, borderRadius: 16, padding: 16},
  pickers: {flexDirection: 'row', justifyContent: 'space-around'},
  stepper: {alignItems: 'center'},
  stepLabel: {fontSize: 10, letterSpacing: 1, marginBottom: 6},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  stepBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  slot: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
