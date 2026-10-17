import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MentorList from '../../components/mentor/MentorList';
import {selectMentor, setMentors} from '../../redux/slices/mentorSlice';
import {getMentors} from '../../services/mentorService';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';
import CustomHeader from '../../components/common/CustomHeader';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

export default function MentorListScreen({navigation, route}: any) {
  const [filter, setFilter] = useState(route.params?.category || 'All');
  const items = useSelector((s: any) => s.mentors.items);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const {theme} = useTheme();

  const fetchMentorsList = useCallback(async () => {
    try {
      setError(null);
      const data = await getMentors({
        skip: 0,
        limit: 50,
      });
      if (data && data.length > 0) {
        dispatch(setMentors(data));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load mentors.');
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMentorsList();
  }, [fetchMentorsList]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsList();
    setRefreshing(false);
  };

  const shown =
    filter === 'All'
      ? items
      : items.filter(
          (m: any) =>
            m.expertise.some((e: string) =>
              e.toLowerCase().includes(filter.toLowerCase()),
            ) ||
            (filter === 'Career' &&
              m.expertise.some((e: string) => e.includes('Career'))),
        );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Explore Mentors"
        onBack={() => navigation.goBack()}
      />
      <View style={[styles.content, {paddingHorizontal: 20}]}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            Mentors for your next move
          </Text>
          <Pressable
            onPress={() => setFilter('All')}
            accessibilityRole="button"
            accessibilityLabel="Clear mentor filters"
            style={[
              styles.filterAction,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}>
            <AssetIcon name="filter" size={18} />
            <AssetIcon name="arrow-down" size={14} />
          </Pressable>
        </View>

        {/* Filter chips with correct theme colors */}
        <View style={styles.filters}>
          {['All', 'Career', 'Business', 'Education'].map(x => {
            const isSelected = filter === x;
            return (
              <Pressable
                onPress={() => setFilter(x)}
                key={x}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${x}`}
                style={[
                  styles.filter,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surfaceMuted,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.ft,
                    {
                      color: isSelected
                        ? theme.colors.onPrimary
                        : theme.colors.text,
                      fontFamily: isSelected
                        ? theme.fonts.bold
                        : theme.fonts.medium,
                    },
                  ]}>
                  {x}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
            <Button
              title="Try Again"
              variant="outline"
              height={40}
              onPress={fetchMentorsList}
              style={{marginTop: 8, alignSelf: 'center'}}
            />
          </View>
        ) : null}

        {loading && !refreshing ? (
          <LoadingIndicator fullScreen={false} />
        ) : (
          <MentorList
            items={shown}
            onSelect={(m: any) => {
              dispatch(selectMentor(m));
              navigation.navigate('MentorDetails');
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.secondary}
                colors={[theme.colors.secondary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="No mentors found"
                description={`We couldn't find any mentors matching "${filter}". Try selecting another category.`}
                actionTitle="Show all mentors"
                action={() => setFilter('All')}
              />
            }
            contentContainerStyle={styles.list}
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
    paddingTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  filterAction: {
    height: 40,
    width: 54,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filter: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ft: {
    fontSize: 13,
  },
  list: {
    paddingBottom: 24,
  },
  errorContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
