import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, Pressable, Alert, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../components/common/Avatar';
import MentorRating from '../../components/mentor/MentorRating';
import MentorAvailability from '../../components/mentor/MentorAvailability';
import Button from '../../components/common/Button';
import {startBooking} from '../../redux/slices/bookingSlice';
import {useTheme} from '../../theme/useTheme';
import CustomHeader from '../../components/common/CustomHeader';
import {fetchMentorDetail} from '../../redux/slices/mentorSlice';
import {mentorService} from '../../services/mentorService';
import {chatService} from '../../services/chatService';
import {getErrorMessage} from '../../services/api';
import {buildAvailableDays, formatDateTime} from '../../utils/mentor';
import useAsync from '../../hooks/useAsync';

export default function MentorDetailsScreen({navigation, route}: any) {
  const m = useSelector((s: any) => s.mentors.selected);
  const detailLoading = useSelector((s: any) => s.mentors.detailLoading);
  const {isAuthenticated, userType} = useSelector((s: any) => s.auth);
  const d = useDispatch<any>();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const slug = route?.params?.slug || m?.slug;
  const [starting, setStarting] = useState<'book' | 'chat' | null>(null);

  useEffect(() => {
    if (slug) d(fetchMentorDetail(slug));
  }, [d, slug]);

  const {data: availability} = useAsync(
    async () => (await mentorService.getAvailability(slug))?.data,
    [slug],
    !!slug,
  );
  const days = useMemo(() => buildAvailableDays(availability), [availability]);
  const nextSlots = days[0]?.slots.map(x => x.label) || [];
  const firstReview = m?.reviews?.[0];

  // Web flow: booking & chat both hang off a seeker<->mentor conversation.
  const openConversation = async (intent: 'book' | 'chat') => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please sign in as a seeker to continue.', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Sign in', onPress: () => navigation.navigate('Login', {redirect: true})},
      ]);
      return;
    }
    if (userType === 'mentor') {
      Alert.alert('Not available', 'Mentor accounts cannot book sessions. Sign in as a seeker.');
      return;
    }
    setStarting(intent);
    try {
      const res = await chatService.startConversation(m.slug);
      const conversationId = res?.data?.id ? String(res.data.id) : null;
      if (intent === 'book') {
        d(startBooking({mentor: m, conversationId}));
        navigation.navigate('SelectDate');
      } else if (conversationId) {
        navigation.navigate('Chat', {
          conversationId,
          name: m.name,
          image: m.imageUrl,
          mentor: m,
        });
      } else {
        Alert.alert('Could not start chat', res?.message || 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Something went wrong', getErrorMessage(e));
    } finally {
      setStarting(null);
    }
  };
  const book = () => openConversation('book');

  if (!m) {
    return (
      <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
        <CustomHeader title="Mentor Profile" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={theme.colors.secondary} style={{marginTop: 60}} />
      </View>
    );
  }

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Mentor Profile"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingBottom: (insets.bottom > 0 ? insets.bottom : 0) + 104},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Hero Banner with Avatar */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderBottomColor: theme.colors.border,
            },
          ]}>
          <View
            style={[
              styles.avatarWrap,
              {
                borderColor: theme.colors.surface,
                backgroundColor: theme.colors.surface,
              },
            ]}>
            <Avatar label={m.image} uri={m.imageUrl} size={100} />
          </View>
        </View>

        {/* Content Body with consistent padding */}
        <View style={styles.body}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Text
              style={[
                styles.name,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              {m.name}
            </Text>
            <Text
              style={[
                styles.role,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.medium,
                },
              ]}>
              {m.company ? `${m.role} · ${m.company}` : m.role}
            </Text>

            <View style={styles.ratingRow}>
              <MentorRating rating={m.rating} sessions={m.sessions} />
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsRow}>
            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.metricLabel,
                  {
                    color: theme.colors.mutedText,
                    fontFamily: theme.fonts.regular,
                  },
                ]}>
                Experience
              </Text>
              <Text
                style={[
                  styles.metricValue,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                {m.experience || '—'}
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.metricLabel,
                  {
                    color: theme.colors.mutedText,
                    fontFamily: theme.fonts.regular,
                  },
                ]}>
                Session Rate
              </Text>
              <Text
                style={[
                  styles.metricValue,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                ₹{m.price}
                <Text
                  style={[
                    styles.metricSub,
                    {
                      color: theme.colors.mutedText,
                      fontFamily: theme.fonts.regular,
                    },
                  ]}>
                  {' '}/session
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.metricLabel,
                  {
                    color: theme.colors.mutedText,
                    fontFamily: theme.fonts.regular,
                  },
                ]}>
                Reviews
              </Text>
              <Text
                style={[
                  styles.metricValue,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                {m.sessions}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <Button
            title="Book a session"
            onPress={book}
            loading={starting === 'book'}
            style={styles.bookBtn}
          />
          <Button
            title="Message mentor"
            variant="outline"
            onPress={() => openConversation('chat')}
            loading={starting === 'chat'}
            style={{marginTop: 10, height: 46}}
          />
          {detailLoading ? (
            <ActivityIndicator color={theme.colors.secondary} style={{marginTop: 12}} />
          ) : null}

          {/* About Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHead,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              About
            </Text>
            <Text
              style={[
                styles.copy,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.regular,
                },
              ]}>
              {m.bio || 'This mentor has not added a bio yet.'}
            </Text>
            {m.aboutMe ? (
              <Text
                style={[
                  styles.copy,
                  {
                    color: theme.colors.mutedText,
                    fontFamily: theme.fonts.regular,
                    marginTop: 10,
                  },
                ]}>
                {m.aboutMe.trim()}
              </Text>
            ) : null}
          </View>

          {/* Expertise Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHead,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Expertise
            </Text>
            <View style={styles.chips}>
              {m.expertise.map((x: string) => (
                <View
                  key={x}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: theme.colors.text,
                        fontFamily: theme.fonts.semiBold,
                      },
                    ]}>
                    {x}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Experience Section */}
          {m.experiences?.length ? (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHead,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                Experience
              </Text>
              {m.experiences.map((exp: any, idx: number) => (
                <View
                  key={exp.id || idx}
                  style={[
                    styles.experienceCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      marginBottom: 8,
                    },
                  ]}>
                  <View
                    style={[
                      styles.expIndicator,
                      {backgroundColor: theme.colors.secondary},
                    ]}
                  />
                  <View style={styles.expInfo}>
                    <Text
                      style={[
                        styles.expRole,
                        {color: theme.colors.text, fontFamily: theme.fonts.bold},
                      ]}>
                      {exp.title || exp.designation || exp.role || 'Role'}
                    </Text>
                    <Text
                      style={[
                        styles.expMeta,
                        {
                          color: theme.colors.mutedText,
                          fontFamily: theme.fonts.regular,
                        },
                      ]}>
                      {[exp.company || exp.company_name, exp.location]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Languages Section */}
          {m.languages?.length ? (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHead,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Languages
            </Text>
            <View style={styles.chips}>
              {m.languages.map((lang: string) => (
                <View
                  key={lang}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: theme.colors.text,
                        fontFamily: theme.fonts.medium,
                      },
                    ]}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          ) : null}

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text
                style={[
                  styles.sectionHead,
                  {color: theme.colors.text, fontFamily: theme.fonts.bold},
                ]}>
                Reviews
              </Text>
              <Pressable
                onPress={() => navigation.navigate('MentorReviews')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Text
                  style={[
                    styles.seeAllLink,
                    {color: theme.colors.secondary, fontFamily: theme.fonts.bold},
                  ]}>
                  See all
                </Text>
              </Pressable>
            </View>

            <View
              style={[
                styles.reviewCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Text style={[styles.stars, {color: theme.colors.star}]}>
                {firstReview
                  ? '★'.repeat(Math.round(Number(firstReview.rating) || 0)).padEnd(5, '☆')
                  : '☆☆☆☆☆'}
              </Text>
              <Text
                style={[
                  styles.reviewText,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.fonts.regular,
                  },
                ]}>
                {firstReview
                  ? `"${firstReview.review || firstReview.comment || ''}"`
                  : 'No reviews yet — be the first to book a session.'}
              </Text>
              <Text
                style={[
                  styles.reviewer,
                  {
                    color: theme.colors.mutedText,
                    fontFamily: theme.fonts.medium,
                  },
                ]}>
                {firstReview
                  ? `— ${firstReview.seeker_name || firstReview.full_name || 'Seeker'}${
                      firstReview.created_at ? ', ' + formatDateTime(firstReview.created_at) : ''
                    }`
                  : ''}
              </Text>
            </View>
          </View>

          {/* Availability Section with proper padding */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionHead,
                {color: theme.colors.text, fontFamily: theme.fonts.bold},
              ]}>
              Available Slots
            </Text>
            <Text
              style={[
                styles.availSub,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.regular,
                },
              ]}>
              {days[0]
                ? `Earliest open slots (${days[0].date}):`
                : 'Earliest open slots for 1-on-1 sessions:'}
            </Text>
            <View style={styles.availWrap}>
              {nextSlots.length ? (
                <MentorAvailability times={nextSlots} />
              ) : (
                <Text style={{color: theme.colors.mutedText, fontFamily: theme.fonts.regular, fontSize: 13}}>
                  No open slots right now.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer with theme & safe area padding */}
      <View
        style={[
          styles.stickyFooter,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 14,
          },
        ]}>
        <View style={styles.footerPriceInfo}>
          <Text
            style={[
              styles.footerPrice,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            ₹{m.price}
            <Text
              style={[
                styles.footerPriceUnit,
                {
                  color: theme.colors.mutedText,
                  fontFamily: theme.fonts.regular,
                },
              ]}>
              {' '}/ session
            </Text>
          </Text>
          <Text
            style={[
              styles.footerSub,
              {
                color: theme.colors.mutedText,
                fontFamily: theme.fonts.regular,
              },
            ]}>
            Private 1-on-1 session
          </Text>
        </View>
        <Button
          title="Book session"
          onPress={book}
          loading={starting === 'book'}
          style={styles.footerBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  avatarWrap: {
    borderRadius: 56,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 26,
    letterSpacing: -0.3,
  },
  role: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 8,
  },
  ratingRow: {
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 14,
  },
  metricSub: {
    fontSize: 11,
  },
  bookBtn: {
    marginBottom: 8,
  },
  section: {
    marginTop: 22,
  },
  sectionHead: {
    fontSize: 17,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  copy: {
    fontSize: 14.5,
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12.5,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  expIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  expInfo: {
    flex: 1,
  },
  expRole: {
    fontSize: 14.5,
  },
  expMeta: {
    fontSize: 12.5,
    marginTop: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllLink: {
    fontSize: 13,
  },
  reviewCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 2,
  },
  stars: {
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14.5,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  reviewer: {
    fontSize: 12.5,
    marginTop: 10,
  },
  availSub: {
    fontSize: 13,
    marginBottom: 10,
  },
  availWrap: {
    marginTop: 2,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  footerPriceInfo: {
    flex: 1,
  },
  footerPrice: {
    fontSize: 17,
  },
  footerPriceUnit: {
    fontSize: 12,
  },
  footerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  footerBtn: {
    minWidth: 130,
    minHeight: 46,
  },
});
