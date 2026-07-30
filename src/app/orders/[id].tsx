import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const { orders } = useStore();

  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Order not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.accent }]}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStepStatus = (step: 'Placed' | 'Processing' | 'Shipped' | 'Delivered') => {
    const statuses = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statuses.indexOf(order.status);
    const stepIdx = statuses.indexOf(step);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={[styles.header, { borderBottomColor: colors.border }]} edges={['top']}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Receipt & Status</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statusHeader}>
            <View>
              <Text style={[styles.orderIdLabel, { color: colors.textSecondary }]}>ORDER ID</Text>
              <Text style={[styles.orderIdText, { color: colors.text }]}>{order.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.statusBadgeText, { color: colors.accent }]}>{order.status}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            Placed on <Text style={{ color: colors.text, fontWeight: '600' }}>{order.date}</Text>
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={[styles.stepperCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Timeline</Text>

          <View style={styles.timeline}>
            {[
              { key: 'Placed', label: 'Order Confirmed', desc: 'We have received your payment' },
              { key: 'Processing', label: 'Order Processing', desc: 'Preparing & packaging your items' },
              { key: 'Shipped', label: 'Order Shipped', desc: 'Carrier has picked up your package' },
              { key: 'Delivered', label: 'Delivered', desc: 'Parcel left at door/mailbox' },
            ].map((step, index) => {
              const status = getStepStatus(step.key as 'Placed' | 'Processing' | 'Shipped' | 'Delivered');
              const isLast = index === 3;

              return (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.leftTimeline}>
                    <View
                      style={[
                        styles.indicatorCircle,
                        {
                          backgroundColor:
                            status === 'completed' ? '#10B981' : status === 'active' ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      {status === 'completed' ? (
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      ) : (
                        <View
                          style={[
                            styles.innerActiveDot,
                            { backgroundColor: status === 'active' ? '#FFFFFF' : 'transparent' },
                          ]}
                        />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          {
                            backgroundColor: status === 'completed' ? '#10B981' : colors.border,
                          },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.rightTimeline}>
                    <Text
                      style={[
                        styles.stepLabel,
                        {
                          color: status === 'pending' ? colors.textSecondary : colors.text,
                          fontWeight: status === 'active' ? '700' : '600',
                        },
                      ]}
                    >
                      {step.label}
                    </Text>
                    <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(400).springify()}
          style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Purchased Items</Text>
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <View key={index}>
                <View style={styles.itemRow}>
                  <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text numberOfLines={1} style={[styles.itemName, { color: colors.text }]}>
                      {item.product.name}
                    </Text>
                    <View style={styles.variationRow}>
                      <View style={[styles.colorDot, { backgroundColor: item.selectedColor }]} />
                      {item.selectedSize && (
                        <Text style={[styles.sizeText, { color: colors.textSecondary }]}>
                          Size: {item.selectedSize}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.priceQtyText, { color: colors.textSecondary }]}>
                      {formatCurrency(item.product.price)} x {item.quantity}
                    </Text>
                  </View>
                  <Text style={[styles.itemSubtotal, { color: colors.text }]}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </Text>
                </View>
                {index < order.items.length - 1 && (
                  <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(400).springify()}
          style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Billing Details</Text>
          <View style={styles.summaryRows}>
            <View style={styles.billingRow}>
              <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.billingValue, { color: colors.text }]}>
                {formatCurrency(order.total - Math.round(order.total * 0.08) - (order.total > 200 ? 0 : 15))}
              </Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Shipping</Text>
              <Text style={[styles.billingValue, { color: colors.text }]}>
                {order.total > 200 ? 'Free' : formatCurrency(15)}
              </Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={[styles.billingLabel, { color: colors.textSecondary }]}>Estimated Tax (8%)</Text>
              <Text style={[styles.billingValue, { color: colors.text }]}>{formatCurrency(Math.round(order.total * 0.08))}</Text>
            </View>
            <View style={[styles.itemDivider, { backgroundColor: colors.border, marginVertical: 8 }]} />
            <View style={styles.billingRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
              <Text style={[styles.totalValue, { color: colors.accent }]}>{formatCurrency(order.total)}</Text>
            </View>
          </View>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/orders/track', params: { id: order.id } })}
          style={[styles.trackBtn, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
          <Text style={styles.trackBtnText}>Open Live Tracking</Text>
        </TouchableOpacity>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 50,
  },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  dateText: {
    fontSize: 13,
  },
  stepperCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },
  timeline: {
    marginLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 56,
  },
  leftTimeline: {
    alignItems: 'center',
    width: 20,
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  innerActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: -2,
  },
  rightTimeline: {
    flex: 1,
    marginLeft: 14,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 13,
  },
  stepDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  itemsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  variationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  sizeText: {
    fontSize: 11,
  },
  priceQtyText: {
    fontSize: 11,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemDivider: {
    height: 1,
    marginTop: 12,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  summaryRows: {
    gap: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billingLabel: {
    fontSize: 13,
  },
  billingValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    height: 50,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
