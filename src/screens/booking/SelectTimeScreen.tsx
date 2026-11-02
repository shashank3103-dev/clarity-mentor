import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TimePicker from '../../components/booking/TimePicker';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {setSlot} from '../../redux/slices/bookingSlice';
import {useTheme} from '../../theme/useTheme';
import {AvailableDay, formatLongDate, slotDurationMinutes} from '../../utils/mentor';

export default function SelectTimeScreen({navigation, route}: any) {
  const {theme} = useTheme();
  const {slot, date} = useSelector((s: any) => s.booking);
  const dispatch = useDispatch();
  const days: AvailableDay[] = route?.params?.days || [];
  const slots = days.find(d => d.date === date)?.slots || [];

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Select Time" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, {paddingHorizontal: theme.spacing.lg}]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.step, {color: theme.colors.secondary, fontFamily: theme.fonts.bold}]}>
          STEP 2 OF 3
        </Text>
        <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Choose a time
        </Text>
        <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
          {date ? formatLongDate(date) : 'Selected day'} · Times shown as set by the mentor
        </Text>

        <Text style={[styles.avail, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
          Available slots
        </Text>

        <TimePicker slots={slots} selectedId={slot?.id} onSelect={s => dispatch(setSlot(s))} />

        {slot ? (
          <View
            style={[
              styles.selectedBanner,
              {backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border},
            ]}>
            <Text style={[styles.selectedText, {color: theme.colors.text, fontFamily: theme.fonts.medium}]}>
              Selected: <Text style={{fontFamily: theme.fonts.bold}}>{slot.label}</Text> (
              {slotDurationMinutes(slot)} mins)
            </Text>
          </View>
        ) : null}

        <Button
          title="Review booking"
          onPress={() => navigation.navigate('Booking')}
          disabled={!slot}
          style={styles.actionBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {paddingTop: 12, paddingBottom: 40},
  step: {fontSize: 10, letterSpacing: 1.1, marginTop: 8},
  title: {fontSize: 22, marginTop: 6},
  body: {fontSize: 13, lineHeight: 18, marginTop: 4},
  avail: {fontSize: 14.5, marginTop: 22, marginBottom: 8},
  selectedBanner: {padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 12, alignItems: 'center'},
  selectedText: {fontSize: 13},
  actionBtn: {marginTop: 24, height: 48},
});
