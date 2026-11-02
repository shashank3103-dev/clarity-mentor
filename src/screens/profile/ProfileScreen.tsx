import React from 'react';
import {ScrollView, View, Text, Pressable, StyleSheet, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../../components/common/Avatar';
import AssetIcon from '../../components/common/AssetIcon';
import CustomHeader from '../../components/common/CustomHeader';
import {logout, refreshUser} from '../../redux/slices/authSlice';
import {useTheme} from '../../theme';
import useAsync from '../../hooks/useAsync';
import {seekerService} from '../../services/seekerService';
import {mentorService} from '../../services/mentorService';
import {imageUrl} from '../../utils/mentor';
import {initials} from '../../utils/helpers';

const seekerLinks = [
  ['My Sessions', 'Sessions'],
  ['Messages', 'Messages'],
  ['Payment History', 'PaymentHistory'],
  ['Become a Mentor', 'BecomeMentor'],
  ['Settings', 'Settings'],
  ['Help & Support', 'HelpSupport'],
];

const mentorLinks = [
  ['My Sessions', 'Sessions'],
  ['Availability', 'Availability'],
  ['Payment History', 'PaymentHistory'],
  ['Wallet & Payouts', 'Wallet'],
  ['Settings', 'Settings'],
  ['Help & Support', 'HelpSupport'],
];
const socials = ['facebook', 'x', 'instagram', 'ln'] as const;

export default function ProfileScreen({navigation}: any) {
  const {user: p, userType} = useSelector((s: any) => s.auth);
  const d = useDispatch<any>();
  const {theme} = useTheme();
  const isMentor = userType === 'mentor';
  const links = isMentor ? mentorLinks : seekerLinks;

  const {data: dash} = useAsync(async () => {
    d(refreshUser());
    const res = isMentor ? await mentorService.getDashboard() : await seekerService.getDashboard();
    return res?.data;
  }, [isMentor]);

  const stats = isMentor
    ? [
        ['Earnings', `₹${dash?.financials?.total_earnings || '0.00'}`],
        ['Sessions', dash?.sessions?.total ?? 0],
        ['Rating', dash?.quality?.average_rating || '—'],
      ]
    : [
        ['Spent', `₹${dash?.financials?.total_spent || '0.00'}`],
        ['Booked', dash?.sessions?.total_booked ?? 0],
        ['Hours', parseFloat(dash?.sessions?.total_learning_hours || '0').toFixed(1)],
      ];

  // RootNavigator's session guard sends us to Login once auth clears.
  const handleLogout = () => d(logout());

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="My Profile"
        showBack={navigation?.canGoBack?.()}
        onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined}
      />
      <ScrollView
        contentContainerStyle={[styles.wrap, {paddingHorizontal: 20}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <Avatar
            label={initials(p?.full_name || 'CM')}
            uri={imageUrl(p?.profile_image)}
            size={76}
          />
          <Text
            style={[
              styles.name,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            {p?.full_name || 'Your profile'}
          </Text>
          <Text
            style={[
              styles.role,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {p?.expertise_area || p?.email}
          </Text>
          {isMentor && p?.status ? (
            <Text
              style={{
                marginTop: 6,
                fontSize: 11,
                color: p.status === 'approved' ? theme.colors.success : theme.colors.warning,
                fontFamily: theme.fonts.bold,
              }}>
              {String(p.status).toUpperCase()}
            </Text>
          ) : null}
          {isMentor ? (
          <Pressable
            onPress={() => navigation.navigate('EditProfile')}
            style={[styles.edit, {backgroundColor: theme.colors.secondary}]}>
            <Text
              style={[
                styles.editText,
                {color: theme.colors.onPrimary, fontFamily: theme.fonts.bold},
              ]}>
              Edit profile
            </Text>
          </Pressable>
          ) : null}
        </View>

        <View
          style={[
            styles.stats,
            {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
          ]}>
          {stats.map(([label, value]) => (
            <View key={label as string} style={styles.stat}>
              <Text style={{fontSize: 16, color: theme.colors.text, fontFamily: theme.fonts.bold}}>
                {value}
              </Text>
              <Text style={{fontSize: 11, color: theme.colors.mutedText, fontFamily: theme.fonts.medium, marginTop: 2}}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.list,
            {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
          ]}>
          {links.map(([x, to], i) => (
            <Pressable
              key={x}
              onPress={() => navigation.navigate(to as string)}
              style={[
                styles.row,
                {borderColor: theme.colors.border},
                i === links.length - 1 && {borderBottomWidth: 0},
              ]}>
              <Text
                style={[
                  styles.item,
                  {color: theme.colors.text, fontFamily: theme.fonts.semiBold},
                ]}>
                {x}
              </Text>
              <Image
                source={require('../../assets/icons/tabs/chevron-right.png')}
                style={[styles.chevron, {tintColor: theme.colors.mutedText}]}
                resizeMode="contain"
              />
            </Pressable>
          ))}
          <Pressable
            onPress={handleLogout}
            style={[styles.row, {borderBottomWidth: 0}]}>
            <Text
              style={[
                styles.logout,
                {color: theme.colors.error, fontFamily: theme.fonts.bold},
              ]}>
              Log out
            </Text>
            <Image
              source={require('../../assets/icons/tabs/chevron-right.png')}
              style={[styles.chevron, {tintColor: theme.colors.mutedText}]}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.socialCard,
            {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
          ]}>
          <Text
            style={[
              styles.socialTitle,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            Follow Clarity Mentor
          </Text>
          <Text
            style={[
              styles.socialCopy,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            More honest stories and useful perspective, wherever you scroll.
          </Text>
          <View style={styles.socials}>
            {socials.map(name => (
              <Pressable
                key={name}
                onPress={() => undefined}
                accessibilityRole="button"
                accessibilityLabel={`Open Clarity Mentor on ${name}`}
                style={[
                  styles.socialButton,
                  {backgroundColor: theme.colors.surfaceMuted,},
                ]}>
                <AssetIcon name={name} size={19} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    marginBottom: 16,
  },
  stat: {flex: 1, alignItems: 'center'},
  screen: {
    flex: 1,
  },
  wrap: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 40,
  },
  profile: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  name: {
    fontSize: 24,
    marginTop: 12,
  },
  role: {
    fontSize: 14,
    marginTop: 4,
  },
  edit: {
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  editText: {
    fontSize: 14,
  },
  list: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 54,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    fontSize: 15,
  },
  logout: {
    fontSize: 15,
  },
  chevron: {
    width: 14,
    height: 14,
    opacity: 0.7,
  },
  socialCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  socialTitle: {
    fontSize: 16,
  },
  socialCopy: {
    lineHeight: 20,
    marginTop: 6,
    fontSize: 13,
  },
  socials: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  socialButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',

  },
});
