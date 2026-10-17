import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import CustomHeader from '../../components/common/CustomHeader';
import {updateProfile} from '../../redux/slices/userSlice';
import {useTheme} from '../../theme/useTheme';
import {updateSeekerProfile} from '../../api/seekerApi';
import {tokenStorage} from '../../storage/tokenStorage';
import {required} from '../../utils/validation';
import {showSuccess} from '../../utils/appFeedback';

export default function EditProfileScreen({navigation}: any) {
  const {theme} = useTheme();
  const p = useSelector((s: any) => s.user.profile);

  const [name, setName] = useState(p.name || '');
  const [role, setRole] = useState(p.role || '');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!required(name)) {
      setNameError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateSeekerProfile({
        full_name: name.trim(),
        bio: role.trim(),
      });

      const updated = {name: name.trim(), role: role.trim()};
      dispatch(updateProfile(updated));
      await tokenStorage.setUser({...p, ...updated});

      showSuccess('Your profile details have been saved.', 'Profile Updated');
      navigation.goBack();
    } catch (err: any) {
      setError(
        err?.message ||
        err?.data?.message ||
        'Failed to save changes. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader
        title="Edit Profile"
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            {color: theme.colors.primary, fontFamily: theme.fonts.bold},
          ]}>
          Edit profile
        </Text>

        {error ? <ErrorMessage message={error} /> : null}

        <Input
          label="Name"
          value={name}
          onChangeText={(val: string) => {
            setName(val);
            if (nameError) setNameError('');
            if (error) setError(null);
          }}
          error={nameError}
        />
        <Input
          label="Professional headline"
          value={role}
          onChangeText={setRole}
          placeholder="e.g. Software Engineer, Product Manager"
        />
        <Input label="Email" value={p.email} editable={false} />

        <Button
          title="Save changes"
          loading={loading}
          disabled={loading}
          onPress={handleSave}
          style={{marginTop: 12}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
  },
  title: {
    fontSize: 29,
    marginVertical: 20,
  },
});
