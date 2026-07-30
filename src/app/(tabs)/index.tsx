import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  useWindowDimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { MOCK_PRODUCTS } from '@/constants/MockData';
import CategorySelector from '@/components/CategorySelector';
import ProductCard from '@/components/ProductCard';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';
import { useStore } from '@/context/StoreContext';

const MOCK_BANNERS = [
  {
    id: 'b1',
    subtitle: 'Summer Collection',
    title: 'Up to 30% OFF',
    desc: 'Premium Gear & Audio Accessories',
    code: 'LUX30',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    subtitle: 'Workspace Upgrade',
    title: 'Flat 20% OFF',
    desc: 'Keystone keyboards & leather pads',
    code: 'NEW20',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    subtitle: 'Exclusive Launch',
    title: 'Free Shipping',
    desc: 'Horween leather passport wallets & Chrono trackers',
    code: 'FREESHIP',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
  }
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { cartCount, showToast } = useStore();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');

  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;

  // Badge Spring Animation
  const badgeScale = useSharedValue(1);
  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  useEffect(() => {
    if (cartCount > 0) {
      badgeScale.value = withSequence(
        withSpring(1.5, { damping: 4, stiffness: 120 }),
        withSpring(1)
      );
    }
  }, [badgeScale, cartCount]);

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.nameText, { color: colors.text }]}>Luxe Shopper</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/cart')}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="cart-outline" size={20} color={colors.text} />
            {cartCount > 0 && (
              <Animated.View style={[styles.cartBadge, animatedBadgeStyle, { backgroundColor: colors.accent }]}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/notifications/index' as any)}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View style={[styles.notificationBadge, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main FlatList to scroll search + banner + selector + grid */}
      <FlatList
        key={numColumns}
        data={sortedProducts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            {/* Search Bar Wrapper */}
            <View style={styles.searchWrapper}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/search' as any)}
                style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border, justifyContent: 'space-between' }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                    Search premium products...
                  </Text>
                </View>
                <Ionicons name="options-outline" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>

            {/* Swipable Banners Slideshow */}
            <View style={styles.bannerCarouselContainer}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={MOCK_BANNERS}
                keyExtractor={(item) => item.id}
                onScroll={(event) => {
                  const contentOffset = event.nativeEvent.contentOffset.x;
                  const viewSize = event.nativeEvent.layoutMeasurement.width;
                  if (viewSize > 0) {
                    const index = Math.round(contentOffset / viewSize);
                    if (index !== activeBannerIndex) {
                      setActiveBannerIndex(index);
                    }
                  }
                }}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <View style={{ width: width, paddingHorizontal: 20 }}>
                    <ImageBackground
                      source={{ uri: item.image }}
                      style={[styles.banner, { marginHorizontal: 0 }]}
                      imageStyle={styles.bannerImage}
                    >
                      <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.bannerTitle}>{item.title}</Text>
                        <Text style={styles.bannerDesc}>{item.desc}</Text>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            showToast(`Coupon ${item.code} copied!`, 'success');
                          }}
                          style={[styles.bannerBtn, { backgroundColor: colors.accent }]}
                        >
                          <Text style={styles.bannerBtnText}>Use Code: {item.code}</Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                )}
              />
              
              {/* Pagination Dots */}
              <View style={styles.paginationDotsContainer}>
                {MOCK_BANNERS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor: activeBannerIndex === index ? colors.accent : colors.border,
                        width: activeBannerIndex === index ? 16 : 6,
                      }
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Trending Products */}
            <View style={styles.trendingSection}>
              <View style={styles.trendingHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Items</Text>
                <View style={[styles.hotBadge, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="flame" size={12} color={colors.accent} />
                  <Text style={[styles.hotText, { color: colors.accent }]}>HOT</Text>
                </View>
              </View>
              <FlatList
                horizontal
                data={MOCK_PRODUCTS.slice(0, 4)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
                    style={[styles.trendingCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  >
                    <Image source={{ uri: item.image }} style={styles.trendingImage} />
                    <View style={styles.trendingInfo}>
                      <Text numberOfLines={1} style={[styles.trendingName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.trendingPrice, { color: colors.accent }]}>₹{item.price}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => `trending-${item.id}`}
              />
            </View>

            {/* Daily Rewards Hub */}
            <View style={styles.rewardsHubSection}>
              <View style={[styles.rewardsHubCard, { backgroundColor: '#111827', borderColor: '#F59E0B' }]}>
                <View style={styles.rewardsHubContent}>
                  <View style={styles.rewardsIconBg}>
                    <Ionicons name="sparkles" size={20} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.rewardsHubTitle}>DAILY REWARDS HUB</Text>
                    <Text style={styles.rewardsHubSubtitle}>Play our lucky games to win up to 40% OFF coupons!</Text>
                  </View>
                </View>
                <View style={styles.rewardsHubActions}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/promo/spin' as any)}
                    style={[styles.rewardsHubBtn, { backgroundColor: '#F59E0B' }]}
                  >
                    <Ionicons name="football-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.rewardsHubBtnText}>Lucky Spin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/promo/scratch' as any)}
                    style={[styles.rewardsHubBtn, { backgroundColor: '#1E293B', borderColor: '#F59E0B', borderWidth: 1 }]}
                  >
                    <Ionicons name="gift-outline" size={14} color="#F59E0B" />
                    <Text style={[styles.rewardsHubBtnText, { color: '#F59E0B' }]}>Scratch Card</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Category Selector */}
            <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 20 }]}>Categories</Text>
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                Keyboard.dismiss();
              }}
            />

            {/* Sorting Row */}
            <View style={styles.sortRow}>
              <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortChipsContainer}>
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'low-high', label: 'Price: Low-High' },
                  { id: 'high-low', label: 'Price: High-Low' },
                  { id: 'rating', label: 'Top Rated' }
                ].map((option) => {
                  const isActive = sortBy === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      activeOpacity={0.8}
                      onPress={() => setSortBy(option.id as any)}
                      style={[
                        styles.sortChip,
                        {
                          backgroundColor: isActive ? colors.accentLight : colors.card,
                          borderColor: isActive ? colors.accent : colors.border
                        }
                      ]}
                    >
                      <Text style={[styles.sortChipText, { color: isActive ? colors.accent : colors.textSecondary, fontWeight: isActive ? '700' : '600' }]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.productsHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
              <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                {filteredProducts.length} items
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingTop: 40 }}>
            <AnimatedEmptyState
              icon="search-outline"
              title="No products found"
              description="We couldn't find any products matching your query. Try resetting filters."
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                style={[styles.clearSearchBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.clearSearchBtnText}>Reset Filters</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerComponent: {
    gap: 16,
  },
  searchWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  suggestionsPanel: {
    position: 'absolute',
    top: 52,
    left: 20,
    right: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 99,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noSearchesText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  suggestionChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  banner: {
    height: 160,
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
  },
  bannerImage: {
    borderRadius: 18,
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    padding: 20,
    justifyContent: 'center',
  },
  bannerSubtitle: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  bannerDesc: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  productsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  trendingSection: {
    marginTop: 8,
    gap: 12,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  hotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  hotText: {
    fontSize: 10,
    fontWeight: '800',
  },
  trendingListContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingVertical: 4,
  },
  trendingCard: {
    width: 140,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  trendingImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F5F9',
  },
  trendingInfo: {
    padding: 10,
    gap: 2,
  },
  trendingName: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendingPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    gap: 10,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortChipsContainer: {
    gap: 8,
    paddingRight: 20,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 11,
  },
  bannerCarouselContainer: {
    marginTop: 4,
    position: 'relative',
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  clearSearchBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  rewardsHubSection: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  rewardsHubCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  rewardsHubContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardsIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardsHubTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rewardsHubSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  rewardsHubActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rewardsHubBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    gap: 6,
  },
  rewardsHubBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
