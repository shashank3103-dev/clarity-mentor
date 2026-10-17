import React from 'react';
import {FlatList, FlatListProps} from 'react-native';
import MentorCard from './MentorCard';
import type {Mentor} from '../../types';

interface MentorListProps extends Partial<FlatListProps<Mentor>> {
  items: Mentor[];
  onSelect: (mentor: Mentor) => void;
  contentContainerStyle?: any;
}

export default function MentorList({
  items,
  onSelect,
  contentContainerStyle,
  ...rest
}: MentorListProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={x => x.id}
      renderItem={({item}) => (
        <MentorCard mentor={item} onPress={() => onSelect(item)} />
      )}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
}
