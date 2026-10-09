import React, {useState} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function DecisionScreen({navigation}: any) {
  const {theme} = useTheme();
  const [d, setD] = useState('');
  const [s, setS] = useState('');
  const [o, setO] = useState('');

  return (
    <View>
       <CustomHeader
        title="Find Clarity"
        onBack={() => navigation.goBack()}
      />
    <ScrollView
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={[styles.wrap, {backgroundColor: theme.colors.background}]}>
     
      <Text style={[styles.title, {color: theme.colors.text, fontFamily: theme.fonts.bold}]}>
        Tell us what's on your mind
      </Text>
      <Text style={[styles.body, {color: theme.colors.mutedText, fontFamily: theme.fonts.regular}]}>
        The more context you share, the better we can match you with someone who has lived through something similar.
      </Text>
      <Input
        label="What decision are you facing?"
        value={d}
        onChangeText={setD}
        placeholder="e.g. Should I switch careers?"
      />
      <Input
        label="What's your current situation?"
        value={s}
        onChangeText={setS}
        multiline
        placeholder="Share a little context..."
      />
      <Input
        label="What outcome are you hoping for?"
        value={o}
        onChangeText={setO}
        placeholder="e.g. A confident next step"
      />
      <Button
        title="Find my mentor"
        onPress={() => navigation.navigate('MentorList')}
        style={styles.button}
      />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    marginTop: 16,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
