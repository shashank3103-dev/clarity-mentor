import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomHeader from '../../components/common/CustomHeader';
import Avatar from '../../components/common/Avatar';
import ScreenState from '../../components/common/ScreenState';
import {useTheme} from '../../theme/useTheme';
import {chatService, ChatMessage} from '../../services/chatService';
import {getErrorMessage} from '../../services/api';
import {startBooking} from '../../redux/slices/bookingSlice';
import {fetchMentorDetail, selectMentor} from '../../redux/slices/mentorSlice';
import {initials} from '../../utils/helpers';

const POLL_MS = 5000;
const msgTime = (m: ChatMessage) => m.created_at || m.sent_at || '';

// Merge pages from the API (order not guaranteed), dedupe and sort oldest -> newest.
const merge = (a: ChatMessage[], b: ChatMessage[]) => {
  const map = new Map<string | number, ChatMessage>();
  [...a, ...b].forEach(m => map.set(m.id, m));
  return [...map.values()].sort(
    (x, y) => msgTime(x).localeCompare(msgTime(y)) || Number(x.id) - Number(y.id),
  );
};

export default function ChatScreen({navigation, route}: any) {
  const {conversationId, name, image, mentor, mentorSlug} = route.params || {};
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<any>();
  const userType = useSelector((s: any) => s.auth.userType);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const mounted = useRef(true);

  const fetchPage = useCallback(
    async (p: number) => {
      const res = await chatService.getMessages(conversationId, p);
      if (!mounted.current) return;
      setMessages(prev => merge(prev, res?.data || []));
      setTotalPages(res?.pagination?.totalPages || 1);
    },
    [conversationId],
  );

  useEffect(() => {
    mounted.current = true;
    fetchPage(1)
      .then(() => setError(null))
      .catch(e => setError(getErrorMessage(e, 'Could not load messages')))
      .finally(() => mounted.current && setLoading(false));
    chatService.markRead(conversationId).catch(() => {});

    // REST polling stands in for the web's socket.io live updates.
    const timer = setInterval(() => {
      fetchPage(1).catch(() => {});
    }, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [conversationId, fetchPage]);

  const loadOlder = async () => {
    if (loadingOlder || page >= totalPages) return;
    setLoadingOlder(true);
    try {
      await fetchPage(page + 1);
      setPage(page + 1);
    } catch {}
    setLoadingOlder(false);
  };

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText('');
    try {
      await chatService.sendMessage(conversationId, body);
      await fetchPage(1);
    } catch (e) {
      setText(body);
      Alert.alert('Not sent', getErrorMessage(e, 'Message could not be sent.'));
    } finally {
      setSending(false);
    }
  };

  const slug = mentor?.slug || mentorSlug;
  const book = async () => {
    let m = mentor;
    if (!m) {
      const res = await dispatch(fetchMentorDetail(slug));
      if (!fetchMentorDetail.fulfilled.match(res)) {
        Alert.alert('Could not load mentor', String(res.payload || 'Please try again.'));
        return;
      }
      m = res.payload;
    }
    dispatch(selectMentor(m));
    dispatch(startBooking({mentor: m, conversationId}));
    navigation.navigate('SelectDate');
  };

  const data = [...messages].reverse(); // inverted list shows newest at the bottom

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title={name || 'Chat'}
        onBack={() => navigation.goBack()}
        right={
          userType === 'seeker' && slug ? (
            <Pressable
              onPress={book}
              style={[styles.bookBtn, {backgroundColor: theme.colors.secondary}]}
              accessibilityRole="button">
              <Text style={{color: theme.colors.onPrimary, fontFamily: theme.fonts.bold, fontSize: 12}}>Book</Text>
            </Pressable>
          ) : (
            <Avatar label={initials(name || 'CM')} uri={image} size={36} />
          )
        }
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {loading || (error && !messages.length) ? (
          <ScreenState loading={loading} error={error} onRetry={() => fetchPage(1).catch(() => {})} />
        ) : (
          <FlatList
            inverted
            data={data}
            keyExtractor={m => String(m.id)}
            contentContainerStyle={styles.list}
            onEndReached={loadOlder}
            onEndReachedThreshold={0.3}
            ListFooterComponent={loadingOlder ? <ActivityIndicator color={theme.colors.secondary} /> : null}
            ListEmptyComponent={
              <Text style={[styles.empty, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                No messages yet. Start the conversation!
              </Text>
            }
            renderItem={({item: m}) => {
              const own = m.sender_type === userType;
              return (
                <View style={[styles.bubbleRow, own ? styles.right : styles.left]}>
                  <View
                    style={[
                      styles.bubble,
                      own
                        ? {backgroundColor: theme.colors.primary, borderBottomRightRadius: 4}
                        : {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            borderBottomLeftRadius: 4,
                          },
                    ]}>
                    <Text
                      style={{
                        color: own ? theme.colors.onPrimary : theme.colors.text,
                        fontFamily: theme.fonts.regular,
                        fontSize: 14,
                        lineHeight: 20,
                      }}>
                      {m.message}
                    </Text>
                    <Text
                      style={{
                        color: own ? theme.colors.heroMuted : theme.colors.mutedText,
                        fontFamily: theme.fonts.regular,
                        fontSize: 10,
                        marginTop: 4,
                        alignSelf: 'flex-end',
                      }}>
                      {new Date(msgTime(m)).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View
          style={[
            styles.composer,
            {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
              paddingBottom: Math.max(insets.bottom, 10),
            },
          ]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor={theme.colors.mutedText}
            multiline
            maxLength={2000}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                fontFamily: theme.fonts.regular,
              },
            ]}
          />
          <Pressable
            onPress={send}
            disabled={!text.trim() || sending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[styles.send, {backgroundColor: theme.colors.secondary, opacity: !text.trim() || sending ? 0.5 : 1}]}>
            {sending ? (
              <ActivityIndicator color={theme.colors.onPrimary} size="small" />
            ) : (
              <Text style={{color: theme.colors.onPrimary, fontFamily: theme.fonts.bold, fontSize: 13}}>Send</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  list: {paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1},
  empty: {textAlign: 'center', marginTop: 40, fontSize: 13, transform: [{scaleY: -1}]},
  bubbleRow: {flexDirection: 'row', marginVertical: 3},
  left: {justifyContent: 'flex-start'},
  right: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '80%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8},
  composer: {flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 0.5},
  input: {flex: 1, minHeight: 44, maxHeight: 120, borderWidth: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14},
  send: {height: 44, minWidth: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14},
  bookBtn: {paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16},
});
