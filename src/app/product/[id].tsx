import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Dimensions,
  FlatList,
  Share,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { MOCK_PRODUCTS } from '@/constants/MockData';
import { useStore } from '@/context/StoreContext';

import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInUp, FadeOutDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ColorItem = ({ color, isActive, onPress, colors }: { color: string; isActive: boolean; onPress: () => void; colors: any }) => {
  const scale = useSharedValue(isActive ? 1.15 : 1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.15 : 1, { damping: 8, stiffness: 150 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.colorOutline, animStyle, { borderColor: isActive ? colors.accent : 'transparent' }]}>
        <View style={[styles.colorCircle, { backgroundColor: color }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const SizeChipItem = ({ size, isActive, onPress, colors }: { size: string; isActive: boolean; onPress: () => void; colors: any }) => {
  const scale = useSharedValue(isActive ? 1.08 : 1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.08 : 1, { damping: 8, stiffness: 150 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.sizeChip,
          animStyle,
          {
            backgroundColor: isActive ? colors.accent : colors.backgroundElement,
            borderColor: isActive ? colors.accent : colors.border,
          },
        ]}
      >
        <Text style={[styles.sizeChipText, { color: isActive ? '#FFFFFF' : colors.text, fontWeight: isActive ? '600' : '500' }]}>
          {size}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  
  const { wishlist, toggleWishlist, addToCart, showToast } = useStore();

  const [reviewsList, setReviewsList] = useState([
    { id: 'r1', name: 'Alexander V.', rating: 5, comment: 'Absolutely outstanding quality! The packaging was premium, and the performance exceeds my expectations.', date: 'July 14, 2026' },
    { id: 'r2', name: 'Elena R.', rating: 4, comment: 'Very sleek design and matches my desk aesthetic perfectly. Battery life is solid. Highly recommend.', date: 'June 28, 2026' },
    { id: 'r3', name: 'Marcus K.', rating: 5, comment: 'Worth every single penny. The tactile feel is superb, and the materials feel incredibly luxury.', date: 'May 19, 2026' }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const handleSubmitReview = () => {
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      showToast('Please fill out all review fields.', 'error');
      return;
    }
    const newReview = {
      id: `r-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    };
    setReviewsList((prev) => [...prev, newReview]);
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');
    showToast('Review submitted successfully!', 'success');
  };

  // Find product
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const recommendedProducts = MOCK_PRODUCTS.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 5);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Product not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.accent }]}>
            <Text style={{ color: '#FFFFFF' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    router.push('/cart');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out the ${product.name} on LuxeCart for only ₹${product.price}! ${product.description}`,
      });
    } catch {
      showToast('Unable to open the share sheet right now.', 'error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Scrollable Details */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gallery Section */}
        <View style={styles.imageGalleryContainer}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />
            )}
          />

          {/* Dots Indicator */}
          {product.images.length > 1 && (
            <View style={styles.indicatorContainer}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicatorDot,
                    {
                      backgroundColor: i === activeImageIndex ? colors.accent : colors.border,
                      width: i === activeImageIndex ? 16 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Floating Navigation Header */}
          <SafeAreaView style={styles.floatingHeader} edges={['top']}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              style={[styles.floatingHeaderBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.rightHeaderActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShare}
                style={[styles.floatingHeaderBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Ionicons name="share-social-outline" size={20} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleWishlist(product)}
                style={[styles.floatingHeaderBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Ionicons
                  name={isWishlisted ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isWishlisted ? '#EF4444' : colors.text}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Product Details Wrapper */}
        <View style={styles.detailsWrapper}>
          <View style={styles.headerInfo}>
            <Text style={[styles.category, { color: colors.textSecondary }]}>{product.category}</Text>
            <Text style={[styles.title, { color: colors.text }]}>{product.name}</Text>
            
            <View style={styles.ratingPriceRow}>
              <Text style={[styles.price, { color: colors.accent }]}>₹{product.price}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {product.rating} <Text style={{ color: colors.textSecondary }}>({product.reviewsCount} reviews)</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Color Variations */}
          <View style={styles.variationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Color</Text>
            <View style={styles.colorsRow}>
              {product.colors.map((color) => (
                <ColorItem
                  key={color}
                  color={color}
                  isActive={selectedColor === color}
                  onPress={() => setSelectedColor(color)}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          {/* Size Variations */}
          {product.sizes && (
            <View style={styles.variationSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Size</Text>
                <TouchableOpacity onPress={() => setSizeGuideVisible(true)}>
                  <Text style={[styles.sizeGuideLink, { color: colors.accent }]}>Size Guide</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizesRow}>
                {product.sizes.map((size) => (
                  <SizeChipItem
                    key={size}
                    size={size}
                    isActive={selectedSize === size}
                    onPress={() => setSelectedSize(size)}
                    colors={colors}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.variationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {/* Specifications */}
          <View style={styles.variationSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Specifications</Text>
            <View style={[styles.specsTable, { borderColor: colors.border }]}>
              {product.specs.map((spec, i) => (
                <View
                  key={spec.label}
                  style={[
                    styles.specRow,
                    {
                      backgroundColor: i % 2 === 0 ? colors.backgroundElement : colors.card,
                      borderBottomWidth: i === product.specs.length - 1 ? 0 : 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.specLabel, { color: colors.textSecondary }]}>{spec.label}</Text>
                  <Text style={[styles.specValue, { color: colors.text }]}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Customer Reviews */}
          <View style={styles.variationSection}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setReviewsExpanded(!reviewsExpanded)}
              style={styles.reviewsHeaderRow}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Reviews</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {product.rating} <Text style={{ color: colors.textSecondary }}>({reviewsList.length})</Text>
                </Text>
                <Ionicons
                  name={reviewsExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.textSecondary}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>

            {reviewsExpanded && (
              <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutDown.duration(250)}>
                <View style={styles.reviewsList}>
                  {reviewsList.map((review) => (
                    <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                      <View style={styles.reviewHeader}>
                        <Text style={[styles.reviewerName, { color: colors.text }]}>{review.name}</Text>
                        <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
                      </View>
                      <View style={styles.reviewStarsRow}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Ionicons
                            key={idx}
                            name={idx < review.rating ? 'star' : 'star-outline'}
                            size={12}
                            color="#F59E0B"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                      </View>
                      <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>{review.comment}</Text>
                    </View>
                  ))}
                </View>

                {/* Write a Review Section */}
                <View style={[styles.writeReviewContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.writeReviewTitle, { color: colors.text }]}>Write a Review</Text>
                  
                  <TextInput
                    value={newReviewName}
                    onChangeText={setNewReviewName}
                    placeholder="Your Name"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.reviewInput, { color: colors.text, borderColor: colors.border }]}
                  />

                  <View style={styles.starRatingPicker}>
                    <Text style={[styles.starPickerLabel, { color: colors.textSecondary }]}>Rating: </Text>
                    <View style={styles.starPickerRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
                          <Ionicons
                            name={star <= newReviewRating ? 'star' : 'star-outline'}
                            size={20}
                            color="#F59E0B"
                            style={{ marginRight: 4 }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TextInput
                    value={newReviewComment}
                    onChangeText={setNewReviewComment}
                    placeholder="Write your review comments here..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    style={[styles.reviewInput, styles.reviewTextarea, { color: colors.text, borderColor: colors.border }]}
                  />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmitReview}
                    style={[styles.submitReviewBtn, { backgroundColor: colors.accent }]}
                  >
                    <Text style={styles.submitReviewBtnText}>Submit Review</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Recommended Products */}
          <View style={[styles.variationSection, { borderBottomWidth: 0, paddingBottom: 24 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>You May Also Like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedScroll}
            >
              {recommendedProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: '/product/[id]',
                      params: { id: item.id }
                    });
                  }}
                  style={[styles.recommendedCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                  <View style={styles.recommendedInfo}>
                    <Text numberOfLines={1} style={[styles.recommendedName, { color: colors.text }]}>{item.name}</Text>
                    <View style={styles.recommendedMeta}>
                      <Text style={[styles.recommendedPrice, { color: colors.accent }]}>₹{item.price}</Text>
                      <View style={styles.recommendedRatingRow}>
                        <Ionicons name="star" size={10} color="#F59E0B" />
                        <Text style={[styles.recommendedRatingText, { color: colors.text }]}>{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <SafeAreaView style={[styles.bottomActionBar, { backgroundColor: colors.card, borderTopColor: colors.border }]} edges={['bottom']}>
        {/* Quantity control */}
        <View style={[styles.quantitySelector, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityBtn}
          >
            <Ionicons name="remove" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantityValue, { color: colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityBtn}
          >
            <Ionicons name="add" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddToCart}
          style={[styles.buyBtn, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buyBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Size Guide Bottom Sheet Modal */}
      <Modal visible={sizeGuideVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Size Guide</Text>
              <TouchableOpacity onPress={() => setSizeGuideVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetContent}>
              <Text style={[styles.guideIntro, { color: colors.textSecondary }]}>
                Here are the measurements and recommendation details for the options:
              </Text>
              
              <View style={[styles.guideTable, { borderColor: colors.border }]}>
                <View style={[styles.tableHeader, { backgroundColor: colors.backgroundElement, borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableHeaderCell, { color: colors.text, flex: 1.5 }]}>Size</Text>
                  <Text style={[styles.tableHeaderCell, { color: colors.text, flex: 2 }]}>Dimensions</Text>
                  <Text style={[styles.tableHeaderCell, { color: colors.text, flex: 2.5 }]}>Best For</Text>
                </View>
                {[
                  { size: 'Standard', dims: '35 x 25 x 15 cm', fit: 'Daily commute, light travel' },
                  { size: 'Pro (28L)', dims: '42 x 30 x 18 cm', fit: 'Weekend trips, heavy load' }
                ].map((row, idx) => (
                  <View key={idx} style={[styles.tableRow, { borderBottomWidth: idx === 1 ? 0 : 1, borderBottomColor: colors.border }]}>
                    <Text style={[styles.tableCell, { color: colors.text, fontWeight: '700', flex: 1.5 }]}>{row.size}</Text>
                    <Text style={[styles.tableCell, { color: colors.text, flex: 2 }]}>{row.dims}</Text>
                    <Text style={[styles.tableCell, { color: colors.textSecondary, flex: 2.5 }]}>{row.fit}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.guideNote, { color: colors.textSecondary }]}>
                * Manually measured; please allow 1-2 cm variance.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageGalleryContainer: {
    height: width * 1.05,
    width: width,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  galleryImage: {
    width: width,
    height: width * 1.05,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    height: 6,
    borderRadius: 3,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  rightHeaderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  floatingHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsWrapper: {
    padding: 20,
    gap: 18,
  },
  headerInfo: {
    gap: 6,
  },
  category: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  variationSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOutline: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  sizeChipText: {
    fontSize: 13,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  specsTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  specLabel: {
    width: 120,
    fontSize: 13,
    fontWeight: '500',
  },
  specValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 14,
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    overflow: 'hidden',
  },
  quantityBtn: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  buyBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewsList: {
    gap: 12,
    marginTop: 6,
  },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  reviewDate: {
    fontSize: 11,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sizeGuideLink: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  sheetContent: {
    padding: 20,
    gap: 16,
  },
  guideIntro: {
    fontSize: 14,
    lineHeight: 20,
  },
  guideTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
  },
  tableCell: {
    fontSize: 13,
  },
  guideNote: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  writeReviewContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 16,
  },
  writeReviewTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  reviewInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  reviewTextarea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  starRatingPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starPickerLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  starPickerRow: {
    flexDirection: 'row',
  },
  submitReviewBtn: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  recommendedScroll: {
    gap: 12,
    paddingRight: 20,
  },
  recommendedCard: {
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F5F9',
  },
  recommendedInfo: {
    padding: 8,
    gap: 4,
  },
  recommendedName: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedPrice: {
    fontSize: 12,
    fontWeight: '700',
  },
  recommendedRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  recommendedRatingText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
