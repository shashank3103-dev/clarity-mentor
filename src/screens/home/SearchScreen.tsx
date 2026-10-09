import React, {useState, useMemo} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MentorList from '../../components/mentor/MentorList';
import {selectMentor} from '../../redux/slices/mentorSlice';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function SearchScreen({navigation}: any) {
  const {theme} = useTheme();
  const [q, setQ] = useState('');
  const items = useSelector((s: any) => s.mentors.items);
  const d = useDispatch();

  const filtered = useMemo(
    () =>
      items.filter((m: any) =>
        (m.name + m.role + m.expertise.join(' '))
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [q, items],
  );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Search Mentors"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <TextInput
          autoFocus
          placeholder="Search mentors, topics or roles"
          placeholderTextColor={theme.colors.mutedText}
          value={q}
          onChangeText={setQ}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
              fontFamily: theme.fonts.regular,
            },
          ]}
        />
        <MentorList
          items={filtered}
          onSelect={m => {
            d(selectMentor(m));
            navigation.navigate('MentorDetails');
          }}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    marginTop: 10,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});
