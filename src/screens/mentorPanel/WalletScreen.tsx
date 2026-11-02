import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomHeader from '../../components/common/CustomHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {useTheme} from '../../theme/useTheme';
import useAsync from '../../hooks/useAsync';
import {mentorService} from '../../services/mentorService';
import {getErrorMessage} from '../../services/api';
import {refreshUser} from '../../redux/slices/authSlice';
import {BUSINESS_CATEGORIES, BUSINESS_SUBCATEGORIES, BUSINESS_TYPES} from '../../constants/wallet';

type Mode = 'none' | 'bank' | 'razorpay';

export default function WalletScreen({navigation}: any) {
  const {theme} = useTheme();
  const dispatch = useDispatch<any>();
  const user = useSelector((s: any) => s.auth.user) || {};
  const bankDetail = Array.isArray(user.bank_details) && user.bank_details.length ? user.bank_details[0] : null;
  const [mode, setMode] = useState<Mode>('none');
  const [saving, setSaving] = useState(false);

  const {data: dash} = useAsync(async () => (await mentorService.getDashboard())?.data, []);

  // Bank details (web: add-bank-details-form)
  const [bank, setBank] = useState({
    beneficiary_name: bankDetail?.beneficiary_name || user.full_name || '',
    account_number: '',
    ifsc_code: bankDetail?.ifsc_code || '',
    pan_number: '',
    gst_number: '',
  });

  // Razorpay linked account (web: add-account-form, flattened into one page)
  const [acc, setAcc] = useState({
    email: user.email || '',
    phone: '',
    contact_name: user.full_name || '',
    reference_id: '',
    legal_business_name: user.full_name || '',
    business_type: 'individual',
    category: 'education',
    subcategory: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const submitBank = async () => {
    if (!bank.beneficiary_name.trim() || !bank.account_number.trim() || !bank.ifsc_code.trim()) {
      return Alert.alert('Missing details', 'Beneficiary name, account number and IFSC are required.');
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc_code.trim().toUpperCase())) {
      return Alert.alert('Invalid IFSC', 'Please enter a valid 11-character IFSC code.');
    }
    setSaving(true);
    try {
      await mentorService.addBankDetails({
        beneficiary_name: bank.beneficiary_name.trim(),
        account_number: bank.account_number.trim(),
        ifsc_code: bank.ifsc_code.trim().toUpperCase(),
        ...(bank.pan_number ? {pan_number: bank.pan_number.trim().toUpperCase()} : {}),
        ...(bank.gst_number ? {gst_number: bank.gst_number.trim().toUpperCase()} : {}),
      });
      await dispatch(refreshUser());
      setMode('none');
      Alert.alert('Saved', 'Bank details saved successfully.');
    } catch (e) {
      Alert.alert('Could not save', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const submitAccount = async () => {
    const required = ['email', 'phone', 'contact_name', 'legal_business_name', 'street1', 'city', 'state', 'postal_code'];
    if (required.some(k => !String((acc as any)[k]).trim())) {
      return Alert.alert('Missing details', 'Please fill in all required fields.');
    }
    setSaving(true);
    try {
      await mentorService.addBankAccount({
        email: acc.email.trim(),
        phone: acc.phone.trim(),
        type: 'route',
        reference_id: acc.reference_id.trim(),
        legal_business_name: acc.legal_business_name.trim(),
        business_type: acc.business_type,
        contact_name: acc.contact_name.trim(),
        profile: {
          category: acc.category,
          subcategory: acc.subcategory.trim(),
          addresses: {
            registered: {
              street1: acc.street1.trim(),
              street2: acc.street2.trim(),
              city: acc.city.trim(),
              state: acc.state.trim(),
              postal_code: acc.postal_code.trim(),
              country: 'IN',
            },
          },
        },
      });
      await dispatch(refreshUser());
      setMode('none');
      Alert.alert('Submitted', 'Your Razorpay account details were submitted.');
    } catch (e) {
      Alert.alert('Could not submit', getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const Chips = ({options, value, onChange}: {options: string[]; value: string; onChange: (v: string) => void}) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}} contentContainerStyle={{gap: 8}}>
      {options.map(o => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange(o)}
            style={[
              styles.chip,
              {backgroundColor: on ? theme.colors.primary : theme.colors.surfaceMuted, borderColor: on ? theme.colors.primary : theme.colors.border},
            ]}>
            <Text style={{fontSize: 12, color: on ? theme.colors.onPrimary : theme.colors.text, fontFamily: theme.fonts.medium}}>
              {o.replace(/_/g, ' ')}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const label = (t: string) => (
    <Text style={[styles.label, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>{t}</Text>
  );

  return (
    <View style={[styles.page, {backgroundColor: theme.colors.background}]}>
      <CustomHeader title="Wallet & Payouts" onBack={() => (mode === 'none' ? navigation.goBack() : setMode('none'))} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {mode === 'none' ? (
          <>
            <View style={styles.stats}>
              {[
                ['Total earnings', `₹${dash?.financials?.total_earnings || '0.00'}`],
                ['Last 7 days', `₹${dash?.financials?.last_7_days_earnings || '0.00'}`],
                ['Completed', dash?.sessions?.completed ?? 0],
                ['Upcoming', dash?.sessions?.upcoming ?? 0],
              ].map(([k, v]) => (
                <View key={k as string} style={[styles.tile, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
                  <Text style={{fontSize: 17, color: theme.colors.text, fontFamily: theme.fonts.bold}}>{v}</Text>
                  <Text style={{fontSize: 11.5, color: theme.colors.mutedText, fontFamily: theme.fonts.medium}}>{k}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
              <Text style={[styles.cardTitle, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>Bank account</Text>
              {bankDetail ? (
                <Text style={[styles.cardBody, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                  {bankDetail.beneficiary_name}
                  {'\n'}A/C ****{String(bankDetail.account_number || '').slice(-4)} · {bankDetail.ifsc_code}
                </Text>
              ) : (
                <Text style={[styles.cardBody, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                  Add your bank account for direct transfers of your earnings.
                </Text>
              )}
              <Button
                title={bankDetail ? 'Update bank details' : 'Add bank details'}
                variant="secondary"
                height={44}
                onPress={() => setMode('bank')}
              />
            </View>

            <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
              <Text style={[styles.cardTitle, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>Razorpay account</Text>
              <Text style={[styles.cardBody, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
                Set up your Razorpay linked account for payment processing.
              </Text>
              <Button title="Add Razorpay account" variant="outline" height={44} onPress={() => setMode('razorpay')} />
            </View>
          </>
        ) : mode === 'bank' ? (
          <>
            <Input label="Beneficiary name *" value={bank.beneficiary_name} onChangeText={(v: string) => setBank({...bank, beneficiary_name: v})} />
            <Input
              label="Account number *"
              value={bank.account_number}
              onChangeText={(v: string) => setBank({...bank, account_number: v.replace(/[^0-9]/g, '')})}
              keyboardType="number-pad"
            />
            <Input label="IFSC code *" value={bank.ifsc_code} onChangeText={(v: string) => setBank({...bank, ifsc_code: v.toUpperCase()})} autoCapitalize="characters" />
            <Input label="PAN (optional)" value={bank.pan_number} onChangeText={(v: string) => setBank({...bank, pan_number: v.toUpperCase()})} autoCapitalize="characters" />
            <Input label="GST (optional)" value={bank.gst_number} onChangeText={(v: string) => setBank({...bank, gst_number: v.toUpperCase()})} autoCapitalize="characters" />
            <Button title="Save bank details" onPress={submitBank} loading={saving} />
          </>
        ) : (
          <>
            <Input label="Email *" value={acc.email} onChangeText={(v: string) => setAcc({...acc, email: v})} keyboardType="email-address" autoCapitalize="none" />
            <Input label="Phone *" value={acc.phone} onChangeText={(v: string) => setAcc({...acc, phone: v.replace(/[^0-9]/g, '')})} keyboardType="phone-pad" />
            <Input label="Contact name *" value={acc.contact_name} onChangeText={(v: string) => setAcc({...acc, contact_name: v})} />
            <Input label="Reference ID" value={acc.reference_id} onChangeText={(v: string) => setAcc({...acc, reference_id: v})} />
            <Input label="Legal business name *" value={acc.legal_business_name} onChangeText={(v: string) => setAcc({...acc, legal_business_name: v})} />
            {label('Business type')}
            <Chips options={BUSINESS_TYPES} value={acc.business_type} onChange={v => setAcc({...acc, business_type: v})} />
            {label('Business category')}
            <Chips options={BUSINESS_CATEGORIES} value={acc.category} onChange={v => setAcc({...acc, category: v, subcategory: ''})} />
            {(BUSINESS_SUBCATEGORIES as any)[acc.category]?.length ? (
              <>
                {label('Subcategory')}
                <Chips
                  options={(BUSINESS_SUBCATEGORIES as any)[acc.category]}
                  value={acc.subcategory}
                  onChange={v => setAcc({...acc, subcategory: v})}
                />
              </>
            ) : null}
            <Input label="Street address *" value={acc.street1} onChangeText={(v: string) => setAcc({...acc, street1: v})} />
            <Input label="Street address 2" value={acc.street2} onChangeText={(v: string) => setAcc({...acc, street2: v})} />
            <Input label="City *" value={acc.city} onChangeText={(v: string) => setAcc({...acc, city: v})} />
            <Input label="State *" value={acc.state} onChangeText={(v: string) => setAcc({...acc, state: v})} />
            <Input
              label="Postal code *"
              value={acc.postal_code}
              onChangeText={(v: string) => setAcc({...acc, postal_code: v.replace(/[^0-9]/g, '')})}
              keyboardType="number-pad"
              maxLength={6}
            />
            <Button title="Submit account" onPress={submitAccount} loading={saving} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {padding: 20, paddingBottom: 48},
  stats: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10},
  tile: {width: '48.5%', borderWidth: 1, borderRadius: 16, padding: 14},
  card: {borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 16},
  cardTitle: {fontSize: 15},
  cardBody: {fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 14},
  label: {fontSize: 13, marginBottom: 7},
  chip: {borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7},
});
