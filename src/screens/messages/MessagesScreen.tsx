import React, {useCallback} from 'react';
import {View, Text, Pressable, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import CustomHeader from '../../components/common/CustomHeader';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import ScreenState from '../../components/common/ScreenState';
import {useTheme} from '../../theme/useTheme';
import useAsync from '../../hooks/useAsync';
import {chatService, Conversation} from '../../services/chatService';
import {formatDateTime, imageUrl} from '../../utils/mentor';
import {initials} from '../../utils/helpers';

const lastText = (c: Conversation) =>
  typeof c.last_message === 'string' ? c.last_message : c.last_message?.message || '';

export default function MessagesScreen({navigation}: any) {
  const {theme} = useTheme();
  const userType = useSelector((s: any) => s.auth.userType);
  const {data, loading, refreshing, error, reload, refresh, silentReload} = useAsync(
    async () => {
      const res = await chatService.getConversations(1, 50);
      return (res?.data || []) as Conversation[];
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      silentReload();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const renderItem = ({item: c}: {item: Conversation}) => {
    const unread = Number(c.unread_count) || 0;
    const when = c.last_message?.created_at || c.updated_at;
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: String(c.id),
            name: c.other_name,
            image: imageUrl(c.other_image),
            mentorSlug: c.other_slug || c.profile_slug,
          })
        }
        style={({pressed}) => [
          styles.row,
          {borderColor: theme.colors.border, backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent'},
        ]}>
        <Avatar label={initials(c.other_name || 'CM')} uri={imageUrl(c.other_image)} size={48} />
        <View style={styles.info}>
          <View style={styles.top}>
            <Text numberOfLines={1} style={[styles.name, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
              {c.other_name || 'Conversation'}
            </Text>
            {when ? (
              <Text style={[styles.time, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                {formatDateTime(when)}
              </Text>
            ) : null}
          </View>
          <View style={styles.top}>
            <Text
              numberOfLines={1}
              style={[
                styles.preview,
                {
                  color: unread ? theme.colors.text : theme.colors.mutedText,
                  fontFamily: unread ? theme.fonts.semiBold : theme.fonts.regular,
                },
              ]}>
              {lastText(c) || 'Say hello 👋'}
            </Text>
            {unread ? (
              <View style={[styles.badge, {backgroundColor: theme.colors.secondary}]}>
                <Text style={{color: theme.colors.onPrimary, fontFamily: theme.fonts.bold, fontSize: 11}}>{unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Messages"
        showBack={navigation?.canGoBack?.()}
        onBack={navigation?.canGoBack?.() ? () => navigation.goBack() : undefined}
      />
      {loading || (error && !data) ? (
        <ScreenState loading={loading} error={error} onRetry={reload} />
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={c => String(c.id)}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.colors.secondary} />}
          ListEmptyComponent={
            <EmptyState
              title="No conversations yet"
              description={
                userType === 'mentor'
                  ? 'When a seeker reaches out, the conversation will show up here.'
                  : 'Message a mentor from their profile to start a conversation.'
              }
              actionTitle={userType === 'mentor' ? undefined : 'Find a mentor'}
              action={userType === 'mentor' ? undefined : () => navigation.navigate('Explore')}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  row: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5},
  info: {flex: 1, marginLeft: 12, gap: 4},
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8},
  name: {fontSize: 15, flex: 1},
  time: {fontSize: 10.5},
  preview: {fontSize: 13, flex: 1},
  badge: {minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5},
});
