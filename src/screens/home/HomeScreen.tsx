import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {categories} from '../../constants/categories';
import {selectMentor, setMentors} from '../../redux/slices/mentorSlice';
import {getMentors} from '../../services/mentorService';
import {useTheme} from '../../theme/useTheme';
import Button from '../../components/common/Button';
import CustomCard from '../../components/common/CustomCard';
import SectionHeader from '../../components/common/SectionHeader';
import Avatar from '../../components/common/Avatar';
import AssetIcon from '../../components/common/AssetIcon';
import CheckIcon from '../../components/common/CheckIcon';
import HomeHeader from '../../components/home/HomeHeader';
import CategoryCard from '../../components/home/CategoryCard';

const prompts = [
  'Should I quit my 9-to-5 and start up?',
  'Is it too late to change careers?',
  'MBA or study abroad?',
  'Should I pivot my business?',
];

export default function HomeScreen({navigation}: any) {
  const {theme} = useTheme();
  const mentors = useSelector((state: any) => state.mentors.items);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const fetchMentorsData = useCallback(async () => {
    try {
      const data = await getMentors({skip: 0, limit: 20});
      if (data && data.length > 0) {
        dispatch(setMentors(data));
      }
    } catch (err) {
      console.log('[HomeScreen] fetchMentorsData error:', err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMentorsData();
  }, [fetchMentorsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMentorsData();
    setRefreshing(false);
  };

  const openMentor = useCallback(
    (mentor: any) => {
      dispatch(selectMentor(mentor));
      navigation.navigate('MentorDetails');
    },
    [dispatch, navigation],
  );

  const renderMentor = ({item}: {item: any}) => (
    <Pressable
      onPress={() => openMentor(item)}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}'s story`}
      style={[
        styles.mentor,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={styles.mentorTop}>
        <Avatar label={item.image} size={42} />
        <View style={styles.mentorTitle}>
          <Text
            numberOfLines={1}
            style={[
              styles.mentorName,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.mentorRole,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {item.role} · {item.company}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={2}
        style={[
          styles.story,
          {color: theme.colors.text, fontFamily: theme.fonts.regular},
        ]}>
        "{item.bio}"
      </Text>
      <View style={styles.mentorFooter}>
        <View style={styles.ratingWrap}>
          <AssetIcon name="star" size={13} accessibilityLabel="Rating" />
          <Text
            style={[
              styles.rating,
              {color: theme.colors.star, fontFamily: theme.fonts.bold},
            ]}>
            {item.rating}
          </Text>
        </View>
        <Text
          style={[
            styles.price,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          From ₹{item.price}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.background}
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Home Header */}
      <HomeHeader
        onMenuPress={() => navigation.openDrawer()}
        onSearchPress={() => navigation.navigate('Search')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={{backgroundColor: theme.colors.background}}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.secondary}
            colors={[theme.colors.secondary]}
          />
        }>
        {/* Hero Card */}
        <View style={[styles.hero, {backgroundColor: theme.colors.heroBg}]}>
          <Text
            style={[
              styles.platform,
              {color: theme.colors.accent, fontFamily: theme.fonts.bold},
            ]}>
            INDIA'S HUMAN-TO-HUMAN CLARITY PLATFORM
          </Text>
          <Text
            style={[
              styles.display,
              {color: theme.colors.white, fontFamily: theme.fonts.extraBold},
            ]}>
            Confused on a{'\n'}
            <Text style={{color: theme.colors.accent}}>big life decision?</Text>
          </Text>
          <Text
            style={[
              styles.lede,
              {color: theme.colors.heroStrong, fontFamily: theme.fonts.bold},
            ]}>
            Talk to someone who's already solved it.
          </Text>
          <Text
            style={[
              styles.support,
              {color: theme.colors.heroMuted, fontFamily: theme.fonts.regular},
            ]}>
            Not a coach. Not a course. A real person who has been at your exact
            crossroads.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Decision')}
            accessibilityRole="button"
            accessibilityLabel="Describe your decision"
            style={[styles.prompt, {backgroundColor: theme.colors.surface}]}>
            <Text
              style={[
                styles.promptText,
                {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
              ]}>
              {prompts[0]}
            </Text>
            <AssetIcon
              name="arrow-right-orange"
              size={20}
              accessibilityLabel="Continue"
            />
          </Pressable>
          <View style={styles.trust}>
            <View style={styles.trustItem}>
              <CheckIcon
                size={11}
                color={theme.colors.heroStrong}
                strokeWidth={2.6}
              />
              <Text
                style={[
                  styles.trustItemText,
                  {color: theme.colors.heroStrong, fontFamily: theme.fonts.semiBold},
                ]}>
                100% private
              </Text>
            </View>
            <View style={styles.trustItem}>
              <CheckIcon
                size={11}
                color={theme.colors.heroStrong}
                strokeWidth={2.6}
              />
              <Text
                style={[
                  styles.trustItemText,
                  {color: theme.colors.heroStrong, fontFamily: theme.fonts.semiBold},
                ]}>
                Free rebook
              </Text>
            </View>
            <View style={styles.trustItem}>
              <CheckIcon
                size={11}
                color={theme.colors.heroStrong}
                strokeWidth={2.6}
              />
              <Text
                style={[
                  styles.trustItemText,
                  {color: theme.colors.heroStrong, fontFamily: theme.fonts.semiBold},
                ]}>
                No commitment
              </Text>
            </View>
          </View>
          <View style={styles.scrollCue}>
            <AssetIcon name="mouse" size={14} accessibilityLabel="Explore" />
            <Text
              style={[
                styles.scrollCueText,
                {color: theme.colors.heroStrong, fontFamily: theme.fonts.semiBold},
              ]}>
              Explore real stories below
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.stat,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              4.8/5
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.semiBold,
                },
              ]}>
              Avg satisfaction
            </Text>
          </View>
          <View
            style={[styles.statRule, {backgroundColor: theme.colors.divider}]}
          />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.stat,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              ₹499
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.semiBold,
                },
              ]}>
              Starts from
            </Text>
          </View>
          <View
            style={[styles.statRule, {backgroundColor: theme.colors.divider}]}
          />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.stat,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              30 min
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.semiBold,
                },
              ]}>
              Clear next step
            </Text>
          </View>
        </View>

        {/* Simple As It Gets - Categories */}
        <SectionHeader
          eyebrow="Simple as it gets"
          title="What's the decision on your mind?"
        />
        <View style={styles.categoryGrid}>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              item={category}
              onPress={() =>
                navigation.navigate('MentorList', {category: category.label})
              }
            />
          ))}
        </View>

        {/* Meet Your Mentors */}
        <SectionHeader
          eyebrow="Meet your mentors"
          title="Not titles. Real decisions."
          action="Browse all"
          onAction={() => navigation.navigate('MentorList')}
        />
        <Text
          style={[
            styles.sectionCopy,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          Their actual stories, not polished bios. Find someone whose lived
          experience feels familiar.
        </Text>
        <FlatList
          horizontal
          data={mentors.slice(0, 5)}
          keyExtractor={item => item.id}
          renderItem={renderMentor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mentorList}
        />

        {/* Promise Card */}
        <CustomCard
          style={[styles.promise, {backgroundColor: theme.colors.surfaceMuted}]}>
          <Text
            style={[
              styles.promiseKicker,
              {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
            ]}>
            ONE HONEST CONVERSATION
          </Text>
          <Text
            style={[
              styles.promiseTitle,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            No scripts. No judgement. Just perspective.
          </Text>
          <Text
            style={[
              styles.promiseCopy,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            Connect privately with a person who understands the family pressure,
            money worry and doubt behind your decision.
          </Text>
          <Button
            title="Find my mentor"
            variant="secondary"
            height={44}
            onPress={() => navigation.navigate('Decision')}
            style={{marginTop: 14, alignSelf: 'flex-start'}}
            rightIcon={
              <AssetIcon
                name="arrow-right"
                size={16}
                accessibilityLabel="Continue"
              />
            }
          />
        </CustomCard>

        {/* Guide */}
        <Pressable
          onPress={() => navigation.navigate('HelpSupport')}
          accessibilityRole="button"
          accessibilityLabel="Read the Clarity guide"
          style={[
            styles.guide,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Image
            source={require('../../assets/images/claritymentor-blog-banner.png')}
            style={styles.guideImage}
          />
          <View style={styles.guideCopy}>
            <View style={styles.guideBrand}>
              <Image
                source={require('../../assets/images/claritymentor-favicon.png')}
                style={styles.favicon}
              />
              <Text
                style={[
                  styles.guideKicker,
                  {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
                ]}>
                CLARITY GUIDE
              </Text>
            </View>
            <Text
              style={[
                styles.guideTitle,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Perspective for your next big decision.
            </Text>
            <Text
              style={[
                styles.guideLink,
                {color: theme.colors.secondary, fontFamily: theme.fonts.semiBold},
              ]}>
              Read helpful answers →
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 48,
  },
  hero: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    paddingTop: 22,
    overflow: 'hidden',
  },
  platform: {
    fontSize: 9.5,
    letterSpacing: 1.1,
  },
  display: {
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  lede: {
    fontSize: 13.5,
    marginTop: 10,
  },
  support: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 300,
  },
  prompt: {
    minHeight: 48,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  trust: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustItemText: {
    fontSize: 10.5,
  },
  scrollCue: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scrollCueText: {
    fontSize: 10.5,
  },
  statRow: {
    marginHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  stat: {
    fontSize: 15,
  },
  statLabel: {
    fontSize: 9.5,
    marginTop: 3,
  },
  statRule: {
    width: 1,
    height: 26,
  },
  categoryGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  sectionCopy: {
    fontSize: 12.5,
    lineHeight: 18,
    paddingHorizontal: 20,
    marginTop: -4,
    marginBottom: 4,
  },
  mentorList: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 14,
    paddingBottom: 6,
  },
  mentor: {
    width: 250,
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    marginRight: 10,
  },
  mentorTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorTitle: {
    marginLeft: 10,
    flex: 1,
  },
  mentorName: {
    fontSize: 14,
  },
  mentorRole: {
    fontSize: 11.5,
    marginTop: 2,
  },
  story: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },
  mentorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    alignItems: 'center',
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  price: {
    fontSize: 12,
  },
  promise: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderWidth: 0,
  },
  promiseKicker: {
    fontSize: 9.5,
    letterSpacing: 1.1,
  },
  promiseTitle: {
    fontSize: 17,
    lineHeight: 23,
    marginTop: 6,
  },
  promiseCopy: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 8,
  },
  guide: {
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  guideImage: {
    width: '100%',
    height: 120,
  },
  guideCopy: {
    padding: 14,
  },
  guideBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favicon: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  guideKicker: {
    fontSize: 9.5,
    letterSpacing: 1.1,
  },
  guideTitle: {
    fontSize: 14.5,
    lineHeight: 20,
    marginTop: 6,
  },
  guideLink: {
    fontSize: 12,
    marginTop: 8,
  },
});
