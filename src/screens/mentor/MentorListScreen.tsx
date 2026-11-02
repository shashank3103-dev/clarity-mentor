import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MentorList from '../../components/mentor/MentorList';
import {fetchCategories, fetchMentors, selectMentor} from '../../redux/slices/mentorSlice';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';
import CustomHeader from '../../components/common/CustomHeader';
import EmptyState from '../../components/common/EmptyState';
import ScreenState from '../../components/common/ScreenState';

type Chip = {key: string; label: string; ids: number[]};

export default function MentorListScreen({navigation, route}: any) {
  const {items, categories, loading, error, page, hasMore} = useSelector((s: any) => s.mentors);
  const d = useDispatch<any>();
  const {theme} = useTheme();
  const [search, setSearch] = useState(route?.params?.search || '');
  const [query, setQuery] = useState(route?.params?.search || '');
  const [chipKey, setChipKey] = useState<string>('all');

  useEffect(() => {
    if (!categories.length) d(fetchCategories());
  }, [d, categories.length]);

  // Top-level API categories as filter chips (like the web expert filters).
  const chips: Chip[] = useMemo(() => {
    const top = categories.filter((c: any) => c.parent_id == null);
    const list: Chip[] = [{key: 'all', label: 'All', ids: []}];
    const keywords: string[] | undefined = route?.params?.keywords;
    if (keywords?.length) {
      const ids = categories
        .filter((c: any) => keywords.some(k => c.name.toLowerCase().includes(k)))
        .map((c: any) => c.id);
      if (ids.length) list.push({key: 'home', label: route.params.category, ids});
    }
    top.forEach((c: any) => list.push({key: String(c.id), label: c.name, ids: [c.id]}));
    return list;
  }, [categories, route?.params]);

  useEffect(() => {
    if (route?.params?.keywords && chips.some(c => c.key === 'home')) setChipKey('home');
  }, [chips, route?.params?.keywords]);

  const activeIds = chips.find(c => c.key === chipKey)?.ids || [];

  useEffect(() => {
    d(fetchMentors({page: 1, search: query || undefined, categories: activeIds}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, query, activeIds.join(',')]);

  // Debounce typing into the search box.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadMore = () => {
    if (!loading && hasMore) {
      d(fetchMentors({page: page + 1, search: query || undefined, categories: activeIds}));
    }
  };

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Explore Mentors"
        showBack={navigation?.canGoBack?.()}
        onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined}
      />
      <View style={[styles.content, {paddingHorizontal: 20}]}>
        <View
          style={[
            styles.search,
            {borderColor: theme.colors.border, backgroundColor: theme.colors.surface},
          ]}>
          <AssetIcon name="search" size={18} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search mentors, skills, decisions"
            placeholderTextColor={theme.colors.mutedText}
            style={[styles.searchInput, {color: theme.colors.text, fontFamily: theme.fonts.regular}]}
            returnKeyType="search"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filters}>
          {chips.map(x => {
            const isSelected = chipKey === x.key;
            return (
              <Pressable
                onPress={() => setChipKey(x.key)}
                key={x.key}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${x.label}`}
                style={[
                  styles.filter,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceMuted,
                    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.ft,
                    {
                      color: isSelected ? theme.colors.onPrimary : theme.colors.text,
                      fontFamily: isSelected ? theme.fonts.bold : theme.fonts.medium,
                    },
                  ]}>
                  {x.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {error && !items.length ? (
          <ScreenState
            error={error}
            onRetry={() => d(fetchMentors({page: 1, search: query, categories: activeIds}))}
          />
        ) : (
          <MentorList
            items={items}
            onSelect={(m: any) => {
              d(selectMentor(m));
              navigation.navigate('MentorDetails', {slug: m.slug});
            }}
            contentContainerStyle={styles.list}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            refreshing={loading && page === 1 && items.length > 0}
            onRefresh={() => d(fetchMentors({page: 1, search: query, categories: activeIds}))}
            ListEmptyComponent={
              loading ? (
                <ScreenState loading />
              ) : (
                <EmptyState
                  title="No mentors found"
                  description="Try a different search or category."
                />
              )
            }
            ListFooterComponent={
              loading && items.length > 0 ? (
                <ActivityIndicator color={theme.colors.secondary} style={{marginVertical: 16}} />
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {flex: 1, paddingTop: 14},
  search: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {flex: 1, fontSize: 14, paddingVertical: 0},
  filtersScroll: {flexGrow: 0, marginTop: 14, marginBottom: 14},
  filters: {gap: 8, paddingRight: 8},
  filter: {borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8},
  ft: {fontSize: 13},
  list: {paddingBottom: 24, flexGrow: 1},
});
