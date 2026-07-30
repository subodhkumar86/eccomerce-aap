import React, { useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
  Keyboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CATEGORIES, MOCK_PRODUCTS } from '@/constants/MockData';
import ProductCard from '@/components/ProductCard';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';

const PRICE_RANGES = [
  { label: 'All', min: 0, max: 9999 },
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 - ₹200', min: 100, max: 200 },
  { label: '₹200 - ₹350', min: 200, max: 350 },
  { label: 'Over ₹350', min: 350, max: 9999 },
];

export default function SearchScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;

  // Search filter logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesPrice =
        product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;

      const matchesRating = product.rating >= minRating;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });
  }, [query, selectedCategory, selectedPriceRange, minRating]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'low-high') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'high-low') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list; // featured (default)
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedPriceRange(PRICE_RANGES[0]);
    setMinRating(0);
    setSortBy('featured');
    setQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Top Search Bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search our luxury catalog..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Keyboard.dismiss();
            setShowFilters((prev) => !prev);
          }}
          style={[
            styles.filterToggleBtn,
            {
              backgroundColor: showFilters ? colors.accentLight : colors.card,
              borderColor: showFilters ? colors.accent : colors.border,
            },
          ]}
        >
          <Ionicons name="funnel" size={18} color={showFilters ? colors.accent : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={[styles.filterPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
            {/* Categories */}
            <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? colors.accent : colors.background,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#FFFFFF' : colors.text, fontSize: 12, fontWeight: active ? '700' : '500' }}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Price Range */}
            <Text style={[styles.filterTitle, { color: colors.textSecondary, marginTop: 12 }]}>Price Budget</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {PRICE_RANGES.map((range) => {
                const active = selectedPriceRange.label === range.label;
                return (
                  <TouchableOpacity
                    key={range.label}
                    onPress={() => setSelectedPriceRange(range)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? colors.accent : colors.background,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#FFFFFF' : colors.text, fontSize: 12, fontWeight: active ? '700' : '500' }}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Minimum Rating */}
            <Text style={[styles.filterTitle, { color: colors.textSecondary, marginTop: 12 }]}>Minimum Rating</Text>
            <View style={styles.chipRow}>
              {[0, 4.0, 4.5, 4.8].map((rating) => {
                const active = minRating === rating;
                return (
                  <TouchableOpacity
                    key={rating}
                    onPress={() => setMinRating(rating)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? colors.accent : colors.background,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={{ color: active ? '#FFFFFF' : colors.text, fontSize: 12, fontWeight: active ? '700' : '500' }}>
                        {rating === 0 ? 'Any Rating' : `${rating} ★`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Sorting */}
            <Text style={[styles.filterTitle, { color: colors.textSecondary, marginTop: 12 }]}>Sort By</Text>
            <View style={[styles.chipRow, { marginBottom: 10 }]}>
              {[
                { id: 'featured', label: 'Featured' },
                { id: 'low-high', label: 'Price: Low-High' },
                { id: 'high-low', label: 'Price: High-Low' },
                { id: 'rating', label: 'Top Rated' },
              ].map((opt) => {
                const active = sortBy === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSortBy(opt.id as any)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active ? colors.accent : colors.background,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? '#FFFFFF' : colors.text, fontSize: 12, fontWeight: active ? '700' : '500' }}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Reset Filters bar */}
          <View style={[styles.filterFooter, { borderTopColor: colors.border }]}>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              Found {filteredProducts.length} items
            </Text>
            <TouchableOpacity onPress={handleResetFilters}>
              <Text style={{ fontSize: 12, color: colors.accent, fontWeight: '700' }}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Grid of Results */}
      <FlatList
        key={numColumns}
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingTop: 60 }}>
            <AnimatedEmptyState
              icon="search-outline"
              title="No products match filters"
              description="Try adjusting your keywords, price range, or categories to find what you need."
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleResetFilters}
                style={[styles.resetFiltersBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Reset Filters</Text>
              </TouchableOpacity>
            </AnimatedEmptyState>
          </View>
        }
        renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  filterToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  filterPanel: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  resetFiltersBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
