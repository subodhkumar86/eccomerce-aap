import React from 'react';
import { FlatList, StyleSheet, Text, View, useColorScheme, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';
import { useRouter } from 'expo-router';

export default function WishlistScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const { wishlist } = useStore();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Wishlist</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Grid List */}
      <FlatList
        key={numColumns}
        data={wishlist}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <View style={{ paddingTop: 60 }}>
            <AnimatedEmptyState
              icon="heart-outline"
              title="Your wishlist is empty"
              description="Tap the heart icon on any product to save it here for later."
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/')}
                style={[styles.exploreBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.exploreBtnText}>Explore Products</Text>
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
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
