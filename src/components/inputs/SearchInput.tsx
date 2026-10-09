import React from 'react';
import {TextInput, View} from 'react-native';
import {useTheme} from '../../theme/useTheme';
import AssetIcon from '../common/AssetIcon';

export default function SearchInput({value, onChangeText, onPress, placeholder = 'Search mentors or decisions'}: any) {
  const {theme} = useTheme();
  return <View style={{flexDirection: 'row', alignItems: 'center', height: 54, paddingHorizontal: 16, borderRadius: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border}}>
    <TextInput editable={!onPress} onPressIn={onPress} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.colors.mutedText} style={{flex: 1, color: theme.colors.text, fontSize: 15}} />
    <AssetIcon name="search" size={20} accessibilityLabel="Search" />
  </View>;
}
