import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import {useTheme} from '../../theme';
import CustomHeader from '../../components/common/CustomHeader';

export default function MySessionsScreen({navigation}: any) {
  const [tab, setTab] = useState('Upcoming');
  const items = useSelector((s: any) => s.sessions.items);
  const {theme} = useTheme();

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="My Sessions"
        showBack={navigation?.canGoBack?.()}
        onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined}
      />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {paddingHorizontal: theme.spacing.lg},
        ]}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.tabs,
            {backgroundColor: theme.colors.surfaceMuted},
          ]}>
          {['Upcoming', 'Completed'].map(x => (
            <Pressable
              key={x}
              onPress={() => setTab(x)}
              style={[
                styles.tab,
                tab === x && {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.cardShadow,
                  elevation: 2,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      tab === x ? theme.colors.text : theme.colors.mutedText,
                    fontFamily:
                      tab === x ? theme.fonts.bold : theme.fonts.medium,
                  },
                ]}>
                {x}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'Upcoming' && items.length === 0 ? (
          <EmptyState
            title="No upcoming sessions"
            description="You don't have any upcoming mentoring sessions yet."
            actionTitle="Find a mentor"
            action={() => navigation.navigate('Explore')}
          />
        ) : (
          items
            .filter(
              (x: any) =>
                x.status === (tab === 'Upcoming' ? 'upcoming' : 'completed'),
            )
            .map((x: any) => (
              <Pressable
                key={x.id}
                onPress={() =>
                  navigation.navigate('SessionDetails', {session: x})
                }
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <Avatar label={x.mentor.image} />
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.name,
                      {color: theme.colors.text, fontFamily: theme.fonts.bold},
                    ]}>
                    {x.mentor.name}
                  </Text>
                  <Text
                    style={[
                      styles.role,
                      {
                        color: theme.colors.mutedText,
                        fontFamily: theme.fonts.regular,
                      },
                    ]}>
                    {x.mentor.role}
                  </Text>
                  <Text
                    style={[
                      styles.date,
                      {
                        color: theme.colors.secondary,
                        fontFamily: theme.fonts.semiBold,
                      },
                    ]}>
                    {x.date} · {x.time}
                  </Text>
                  <Text
                    style={[
                      styles.duration,
                      {
                        color: theme.colors.mutedText,
                        fontFamily: theme.fonts.regular,
                      },
                    ]}>
                    30 minutes
                  </Text>
                </View>
              </Pressable>
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  container: {paddingTop: 16, paddingBottom: 40},
  tabs: {
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  info: {marginLeft: 14, flex: 1},
  name: {fontSize: 16},
  role: {fontSize: 13, marginTop: 2},
  date: {fontSize: 14, marginTop: 10},
  duration: {fontSize: 12, marginTop: 2},
});
