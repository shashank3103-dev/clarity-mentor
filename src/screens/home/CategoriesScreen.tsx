import React from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import {categories} from '../../constants/categories';
import CategoryCard from '../../components/home/CategoryCard';
import CustomHeader from '../../components/common/CustomHeader';
import {useTheme} from '../../theme/useTheme';

export default function CategoriesScreen({navigation}: any) {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <CustomHeader
        title="Explore by Topic"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            {color: theme.colors.text, fontFamily: theme.fonts.bold},
          ]}>
          Browse all categories
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: theme.colors.mutedText, fontFamily: theme.fonts.regular},
          ]}>
          Select a category to connect with mentors specialized in your area of focus.
        </Text>
        <View style={styles.grid}>
          {categories.map(x => (
            <CategoryCard
              key={x.id}
              item={x}
              onPress={() =>
                navigation.navigate('MentorList', {category: x.label, keywords: x.keywords})
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
});
