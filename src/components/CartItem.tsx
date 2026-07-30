import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { SlideOutLeft, LinearTransition } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CartItemType, useStore } from '@/context/StoreContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const { updateQuantity, removeFromCart } = useStore();

  const { product, quantity, selectedColor, selectedSize } = item;

  return (
    <Animated.View
      exiting={SlideOutLeft.duration(250)}
      layout={LinearTransition.springify().damping(14)}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Item Image */}
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

      {/* Details Section */}
      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {product.name}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => removeFromCart(product.id, selectedColor, selectedSize)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Selected Variations */}
        <View style={styles.variations}>
          <View style={styles.colorIndicatorRow}>
            <Text style={[styles.variationText, { color: colors.textSecondary }]}>Color: </Text>
            <View style={[styles.colorDot, { backgroundColor: selectedColor }]} />
          </View>
          {selectedSize && (
            <Text style={[styles.variationText, { color: colors.textSecondary }]}>
              Size: <Text style={[styles.boldText, { color: colors.text }]}>{selectedSize}</Text>
            </Text>
          )}
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.text }]}>₹{product.price * quantity}</Text>

          {/* Quantity Controls */}
          <View style={[styles.quantityControls, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => updateQuantity(product.id, selectedColor, selectedSize, quantity - 1)}
              style={styles.controlBtn}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => updateQuantity(product.id, selectedColor, selectedSize, quantity + 1)}
              style={styles.controlBtn}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  variations: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  variationText: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: '600',
  },
  colorIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  controlBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 8,
    textAlign: 'center',
    minWidth: 20,
  },
});
