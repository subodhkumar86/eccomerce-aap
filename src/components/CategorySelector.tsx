import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { CATEGORIES } from '@/constants/MockData';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <TouchableOpacity
            key={category}
            activeOpacity={0.7}
            onPress={() => onSelectCategory(category)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.accent : colors.backgroundElement,
                borderColor: isActive ? colors.accent : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: isActive ? '600' : '500',
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 14,
  },
});
