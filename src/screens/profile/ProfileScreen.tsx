import React from 'react';
import {ScrollView, View, Text, Pressable, StyleSheet, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../../components/common/Avatar';
import AssetIcon from '../../components/common/AssetIcon';
import CustomHeader from '../../components/common/CustomHeader';
import {logout} from '../../redux/slices/authSlice';
import {useTheme} from '../../theme';

const links = [
  ['My Sessions', 'Sessions'],
  ['Saved Mentors', 'MentorList'],
  ['Notifications', 'Notifications'],
  ['Payment Methods', 'Settings'],
  ['Settings', 'Settings'],
  ['Help & Support', 'HelpSupport'],
  ['Privacy', 'Settings'],
];
const socials = ['facebook', 'x', 'instagram', 'ln'] as const;

export default function ProfileScreen({navigation}: any) {
  const p = useSelector((s: any) => s.user.profile);
  const d = useDispatch();
  const {theme} = useTheme();

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
          <Avatar label="BP" size={76} />
          <Text
            style={[
              styles.name,
              {color: theme.colors.text, fontFamily: theme.fonts.bold},
            ]}>
            {p.name}
          </Text>
          <Text
            style={[
              styles.role,
              {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
            ]}>
            {p.role}
          </Text>
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
            onPress={() => d(logout())}
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
