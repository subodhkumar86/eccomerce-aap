import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, LinearTransition } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { Product } from '@/constants/MockData';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { width } = useWindowDimensions();

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Responsive grid calculation: 2 columns on phone, 3 on larger phone/tablet, 4 on wider screens
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const horizontalPadding = 20 * 2;
  const totalGap = 16 * (numColumns - 1);
  const cardWidth = (width - (horizontalPadding + totalGap)) / numColumns;

  // Reanimated Heart Icon Pop Animation
  const heartScale = useSharedValue(1);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Reanimated Quick Add Button Pop Animation
  const addBtnScale = useSharedValue(1);
  const addBtnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addBtnScale.value }],
  }));

  const handleCardPress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id }
    });
  };

  const handleHeartPress = () => {
    heartScale.value = withSequence(
      withSpring(1.5, { damping: 4, stiffness: 120 }),
      withSpring(1)
    );
    toggleWishlist(product);
  };

  const handleQuickAdd = () => {
    addBtnScale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 150 }),
      withSpring(1)
    );
    addToCart(product, 1, product.colors[0]);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(450).springify().damping(14)}
      layout={LinearTransition.springify().damping(15)}
      style={{ width: cardWidth }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Product Image & Wishlist overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleHeartPress}
            style={[styles.wishlistBtn, { backgroundColor: colors.card }]}
          >
            <Animated.View style={heartAnimatedStyle}>
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={18}
                color={isWishlisted ? '#EF4444' : colors.text}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Product Information */}
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={[styles.category, { color: colors.textSecondary }]}>
            {product.category}
          </Text>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating} <Text style={{ color: colors.textSecondary }}>({product.reviewsCount})</Text>
            </Text>
          </View>

          {/* Price & Action Row */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>₹{product.price}</Text>
            <Animated.View style={addBtnAnimatedStyle}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleQuickAdd}
                style={[styles.addBtn, { backgroundColor: colors.accent }]}
              >
                <Ionicons name="bag-add-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    aspectRatio: 0.9,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    padding: 12,
    gap: 4,
  },
  category: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
