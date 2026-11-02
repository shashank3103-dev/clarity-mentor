import React from 'react';
import {FlatList} from 'react-native';
import MentorCard from './MentorCard';

export default function MentorList({items, onSelect, contentContainerStyle, ...listProps}: any) {
  return (
    <FlatList
      data={items}
      keyExtractor={x => x.id}
      renderItem={({item}) => <MentorCard mentor={item} onPress={() => onSelect(item)} />}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      {...listProps}
    />
  );
}
