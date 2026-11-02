import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import CustomHeader from '../../components/common/CustomHeader';
import EmptyState from '../../components/common/EmptyState';
import ScreenState from '../../components/common/ScreenState';
import {useTheme} from '../../theme/useTheme';
import {seekerService} from '../../services/seekerService';
import {mentorService} from '../../services/mentorService';
import {getErrorMessage} from '../../services/api';
import {formatDateTime} from '../../utils/mentor';

type Transaction = {
  id: number;
  session_id: number;
  amount: string;
  payment_status: 'success' | 'failed' | 'pending' | string;
  payment_time: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  full_name: string;
};

export default function PaymentHistoryScreen({navigation}: any) {
  const {theme} = useTheme();
  const userType = useSelector((s: any) => s.auth.userType);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [more, setMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (p: number, mode: 'load' | 'refresh' | 'more') => {
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setMore(true);
      try {
        const service = userType === 'mentor' ? mentorService : seekerService;
        const res = await service.getPaymentHistory(query, p, 15);
        const body = res?.transactions ? res : res?.data || {};
        setItems(prev => (p === 1 ? body.transactions || [] : [...prev, ...(body.transactions || [])]));
        setPages(body.pagination?.pages || 1);
        setPage(p);
        setError(null);
      } catch (e) {
        setError(getErrorMessage(e, 'Could not load payments'));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setMore(false);
      }
    },
    [query, userType],
  );

  useEffect(() => {
    setLoading(true);
    load(1, 'load');
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const statusColor = (st: string) =>
    st === 'success' ? theme.colors.success : st === 'failed' ? theme.colors.error : theme.colors.warning;

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Payment History" onBack={() => navigation.goBack()} />
      <View style={{paddingHorizontal: 20, paddingTop: 14}}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={userType === 'mentor' ? 'Search by seeker or order ID' : 'Search by mentor or order ID'}
          placeholderTextColor={theme.colors.mutedText}
          style={[
            styles.search,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              fontFamily: theme.fonts.regular,
            },
          ]}
        />
      </View>
      {loading || (error && !items.length) ? (
        <ScreenState loading={loading} error={error} onRetry={() => load(1, 'load')} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={t => String(t.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(1, 'refresh')} tintColor={theme.colors.secondary} />}
          onEndReached={() => !more && page < pages && load(page + 1, 'more')}
          onEndReachedThreshold={0.4}
          ListFooterComponent={more ? <ActivityIndicator color={theme.colors.secondary} /> : null}
          ListEmptyComponent={<EmptyState title="No payments yet" description="Your transactions will appear here." />}
          renderItem={({item: t}) => (
            <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
              <View style={styles.row}>
                <Text style={[styles.name, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
                  {t.full_name || 'Session'}
                </Text>
                <Text style={[styles.amount, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
                  ₹{t.amount}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.meta, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                  Session #{t.session_id} · {formatDateTime(t.payment_time)}
                </Text>
                <Text style={[styles.status, {color: statusColor(t.payment_status), fontFamily: theme.fonts.bold}]}>
                  {String(t.payment_status).toUpperCase()}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                style={[styles.meta, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular, marginTop: 4}]}>
                Order {t.razorpay_order_id}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  search: {height: 46, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 14},
  list: {padding: 20, flexGrow: 1},
  card: {borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 2},
  name: {fontSize: 15, flex: 1},
  amount: {fontSize: 15},
  meta: {fontSize: 11.5, flexShrink: 1},
  status: {fontSize: 10.5, letterSpacing: 0.5},
});
