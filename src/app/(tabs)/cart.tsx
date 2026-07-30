import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';
import CartItem from '@/components/CartItem';
import CheckoutModal from '@/components/CheckoutModal';

export default function CartScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { cart, cartTotal, clearCart, showToast } = useStore();

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shipping = cartTotal > 200 ? 0 : 15;
  const tax = Math.round(cartTotal * 0.08);
  const finalTotal = cartTotal + shipping + tax - discount;

  const applyPromo = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode === 'LUX30') {
      setDiscount(Math.round(cartTotal * 0.3));
      showToast('LUX30 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'NEW20') {
      setDiscount(Math.round(cartTotal * 0.2));
      showToast('NEW20 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'FREESHIP' || normalizedCode === 'SPINSHIP') {
      setDiscount(15);
      showToast('Free shipping applied', 'success');
      return;
    }

    if (normalizedCode === 'ELITE100' && cartTotal >= 300) {
      setDiscount(100);
      showToast('ELITE100 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'SPIN5') {
      setDiscount(Math.round(cartTotal * 0.05));
      showToast('SPIN5 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'SPIN10') {
      setDiscount(Math.round(cartTotal * 0.1));
      showToast('SPIN10 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'SPIN15') {
      setDiscount(Math.round(cartTotal * 0.15));
      showToast('SPIN15 applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'SPINVIP') {
      setDiscount(Math.round(cartTotal * 0.25));
      showToast('SPINVIP (25% Off) applied successfully', 'success');
      return;
    }

    if (normalizedCode === 'SCRATCH40') {
      setDiscount(Math.round(cartTotal * 0.4));
      showToast('SCRATCH40 (40% Off!) applied successfully', 'success');
      return;
    }

    setDiscount(0);
    showToast('That promo code is not available for this cart', 'error');
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    setDiscount(0);
    setPromoCode('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <AnimatedEmptyState
            icon="cart-outline"
            title="Your cart is empty"
            description="Explore our curated luxury products and add items to your cart."
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/')}
              style={[styles.shopBtn, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.shopBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </AnimatedEmptyState>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={cart}
            keyExtractor={(item) => `${item.product.id}-${item.selectedColor}-${item.selectedSize || ''}`}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.footerComponent}>
                <View style={[styles.promoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <TextInput
                    value={promoCode}
                    onChangeText={setPromoCode}
                    placeholder="Enter Promo Code (e.g. LUX30)"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="characters"
                    style={[styles.promoInput, { color: colors.text }]}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => applyPromo(promoCode)}
                    style={[styles.applyBtn, { backgroundColor: colors.backgroundSelected }]}
                  >
                    <Text style={[styles.applyBtnText, { color: colors.text }]}>Apply</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.couponsHeaderRow}>
                  <Text style={[styles.couponsHeaderTitle, { color: colors.textSecondary }]}>Suggested Coupons</Text>
                  <TouchableOpacity onPress={() => router.push('/promo' as any)}>
                    <Text style={[styles.viewAllCouponsLink, { color: colors.accent }]}>View All & VIP Coupons</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.couponsRow}>
                  {[
                    { code: 'LUX30', desc: '30% OFF' },
                    { code: 'NEW20', desc: '20% OFF' },
                    { code: 'FREESHIP', desc: 'Free Ship' },
                    { code: 'ELITE100', desc: 'Rs. 100 OFF' },
                  ].map((coupon) => {
                    const isActive = promoCode === coupon.code;

                    return (
                      <TouchableOpacity
                        key={coupon.code}
                        activeOpacity={0.7}
                        onPress={() => {
                          setPromoCode(coupon.code);
                          applyPromo(coupon.code);
                        }}
                        style={[
                          styles.couponChip,
                          {
                            backgroundColor: isActive ? colors.accentLight : colors.card,
                            borderColor: isActive ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.couponText,
                            {
                              color: isActive ? colors.accent : colors.text,
                              fontWeight: isActive ? '700' : '600',
                            },
                          ]}
                        >
                          {coupon.code} <Text style={{ fontSize: 10, color: colors.textSecondary }}>({coupon.desc})</Text>
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[styles.summaryContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(cartTotal)}</Text>
                  </View>
                  {discount > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Promo Discount</Text>
                      <Text style={[styles.summaryValue, { color: '#10B981' }]}>-{formatCurrency(discount)}</Text>
                    </View>
                  )}
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Estimated Tax (8%)</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(tax)}</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: colors.text }]}>Grand Total</Text>
                    <Text style={[styles.totalValue, { color: colors.accent }]}>{formatCurrency(finalTotal)}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setCheckoutVisible(true)}
                  style={[styles.checkoutBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            }
          />

          <CheckoutModal
            visible={checkoutVisible}
            onClose={() => setCheckoutVisible(false)}
            totalAmount={cartTotal - discount}
            onSuccess={handleCheckoutSuccess}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
  },
  footerComponent: {
    marginTop: 10,
    gap: 16,
    paddingBottom: 24,
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  promoInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  applyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shopBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  couponsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  couponChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  couponText: {
    fontSize: 11,
  },
  couponsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  couponsHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  viewAllCouponsLink: {
    fontSize: 11,
    fontWeight: '600',
  },
});
