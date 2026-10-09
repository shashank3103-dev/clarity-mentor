import React, {useState} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {updateProfile} from '../../redux/slices/userSlice';
import {useTheme} from '../../theme/useTheme';

export default function EditProfileScreen({navigation}: any) {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  
  const p = useSelector((s: any) => s.user.profile);
  const [name, setName] = useState(p.name);
  const [role, setRole] = useState(p.role);
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CustomHeader title="Edit Profile" showBack />
      <ScrollView contentContainerStyle={[styles.wrap, {padding: theme.spacing.lg}]}>
        <Text style={[styles.title, {color: theme.colors.primary, fontFamily: theme.fonts.bold}]}>Edit profile</Text>
        
        <Input label="Name" value={name} onChangeText={setName} />
        <Input label="Professional headline" value={role} onChangeText={setRole} />
        <Input label="Email" value={p.email} editable={false} />
        
        <Button
          title="Save changes"
          onPress={() => {
            dispatch(updateProfile({name, role}));
            navigation.goBack();
          }}
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
