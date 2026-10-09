import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MentorList from '../../components/mentor/MentorList';
import {selectMentor} from '../../redux/slices/mentorSlice';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../../components/common/AssetIcon';
import CustomHeader from '../../components/common/CustomHeader';

export default function MentorListScreen({navigation, route}: any) {
  const [filter, setFilter] = useState(route.params?.category || 'All');
  const items = useSelector((s: any) => s.mentors.items);
  const d = useDispatch();
  const {theme} = useTheme();

  const shown =
    filter === 'All'
      ? items
      : items.filter(
          (m: any) =>
            m.expertise.some((e: string) =>
              e.toLowerCase().includes(filter.toLowerCase()),
            ) || (filter === 'Career' && m.expertise.some((e: string) => e.includes('Career'))),
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

        <MentorList
          items={shown}
          onSelect={(m: any) => {
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
});
