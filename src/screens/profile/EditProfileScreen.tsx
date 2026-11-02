import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {refreshUser} from '../../redux/slices/authSlice';
import {fetchCategories} from '../../redux/slices/mentorSlice';
import {mentorService} from '../../services/mentorService';
import {getErrorMessage} from '../../services/api';
import {useTheme} from '../../theme/useTheme';

// Only mentors have an editable profile on the web; seekers' profile is read-only.
export default function EditProfileScreen({navigation}: any) {
  const {theme} = useTheme();
  const dispatch = useDispatch<any>();
  const p = useSelector((s: any) => s.auth.user) || {};
  const categories = useSelector((s: any) => s.mentors.categories);

  const [name, setName] = useState(p.full_name || '');
  const [headline, setHeadline] = useState(p.expertise_area || '');
  const [bio, setBio] = useState(p.bio || '');
  const [rate, setRate] = useState(p.hourly_rate ? String(parseFloat(p.hourly_rate)) : '');
  const [selected, setSelected] = useState<number[]>((p.categories || []).map((c: any) => c.id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  const toggle = (id: number) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const save = async () => {
    if (name.trim().length < 2) return Alert.alert('Check your name', 'Name must be at least 2 characters.');
    if (!(Number(rate) > 0)) return Alert.alert('Check your rate', 'Enter a valid session rate.');
    if (!selected.length) return Alert.alert('Pick a category', 'Choose at least one area you mentor in.');
    setSaving(true);
    try {
      await mentorService.updateProfile({
        full_name: name.trim(),
        bio: bio.trim(),
        hourly_rate: Number(rate),
        expertise_area: headline.trim(),
        category_ids: selected,
      });
      await dispatch(refreshUser());
      Alert.alert('Saved', 'Your profile has been updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Could not save', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader title="Edit Profile" showBack />
      <ScrollView contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]} keyboardShouldPersistTaps="handled">
        <Input label="Full name" value={name} onChangeText={setName} />
        <Input
          label="Professional headline"
          value={headline}
          onChangeText={setHeadline}
          placeholder="e.g. Career & Leadership Mentor"
        />
        <Input
          label="Session rate (₹)"
          value={rate}
          onChangeText={(v: string) => setRate(v.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
        />
        <Input label="Bio" value={bio} onChangeText={setBio} multiline placeholder="Tell seekers how you can help" />
        <Input label="Email" value={p.email} editable={false} />

        <Text style={[styles.label, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>Categories</Text>
        <View style={styles.chips}>
          {categories.map((c: any) => {
            const on = selected.includes(c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => toggle(c.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: on ? theme.colors.primary : theme.colors.surfaceMuted,
                    borderColor: on ? theme.colors.primary : theme.colors.border,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 12,
                    color: on ? theme.colors.onPrimary : theme.colors.text,
                    fontFamily: on ? theme.fonts.bold : theme.fonts.medium,
                  }}>
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Button title="Save changes" onPress={save} loading={saving} style={{marginTop: 20}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flexGrow: 1, paddingBottom: 48},
  label: {fontSize: 13, marginBottom: 8},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7},
});
