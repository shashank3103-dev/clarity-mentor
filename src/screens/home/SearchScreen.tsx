import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {mentorService} from '../../services/mentorService';
import {normalizeMentor} from '../../utils/mentor';
import useAsync from '../../hooks/useAsync';
import ScreenState from '../../components/common/ScreenState';
import EmptyState from '../../components/common/EmptyState';
import MentorList from '../../components/mentor/MentorList';
import {selectMentor} from '../../redux/slices/mentorSlice';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function SearchScreen({navigation}: any) {
  const {theme} = useTheme();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const d = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  const {data, loading, error, reload} = useAsync(
    async () => {
      const res = await mentorService.getMentors(1, 20, {search: query});
      return (res?.data || []).map(normalizeMentor);
    },
    [query],
    query.length > 0,
  );
  const filtered = query ? data || [] : [];

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
        {loading || error ? (
          <ScreenState loading={loading} error={error} onRetry={reload} />
        ) : (
          <MentorList
            items={filtered}
            onSelect={(m: any) => {
              d(selectMentor(m));
              navigation.navigate('MentorDetails', {slug: m.slug});
            }}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              query ? (
                <EmptyState title="No matches" description={`No mentors found for "${query}".`} />
              ) : null
            }
          />
        )}
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
