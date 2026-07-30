import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CATEGORIES, MOCK_PRODUCTS } from '@/constants/MockData';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Subcomponent for each animated chip
const CategoryChipItem = ({
  category,
  isActive,
  onPress,
  colors,
}: {
  category: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
}) => {
  const scale = useSharedValue(isActive ? 1.06 : 1);

  // Dynamic counts calculations
  const count = category === 'All'
    ? MOCK_PRODUCTS.length
    : MOCK_PRODUCTS.filter((p) => p.category === category).length;

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.06 : 1, {
      damping: 10,
      stiffness: 140,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={[
          styles.chip,
          animatedStyle,
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
          {category} <Text style={{ fontSize: 11, opacity: isActive ? 0.9 : 0.6 }}>({count})</Text>
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

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
      {CATEGORIES.map((category) => (
        <CategoryChipItem
          key={category}
          category={category}
          isActive={selectedCategory === category}
          onPress={() => onSelectCategory(category)}
          colors={colors}
        />
      ))}
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
    paddingHorizontal: 16,
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
