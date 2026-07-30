import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  Dimensions,
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
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

const { width } = Dimensions.get('window');

const STATUS_CONFIG = {
  Processing: {
    badge: 'Preparing',
    eta: 'Estimated delivery in 3 to 4 business days',
    truckLabel: 'Warehouse',
    progress: 0.18,
    courier: 'Fulfillment Team',
    courierRole: 'Packaging Specialist',
    nextStep: 'Your order is being packed and labeled for dispatch.',
  },
  Shipped: {
    badge: 'In Transit',
    eta: 'Estimated delivery tomorrow by 6:00 PM',
    truckLabel: 'Regional Hub',
    progress: 0.62,
    courier: 'Rajesh Kumar',
    courierRole: 'Premium Logistics Advisor',
    nextStep: 'Your parcel is moving between hubs and is on schedule.',
  },
  Delivered: {
    badge: 'Delivered',
    eta: 'Delivered successfully',
    truckLabel: 'Delivered',
    progress: 0.92,
    courier: 'Delivery Completed',
    courierRole: 'Proof of delivery recorded',
    nextStep: 'Your package was delivered to the saved address.',
  },
} as const;

export default function OrderTrackScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { orders } = useStore();

  const order = orders.find((item) => item.id === id);

  const truckProgress = useSharedValue(0.1);
  const pulseScale = useSharedValue(1);

  const statusConfig = order ? STATUS_CONFIG[order.status] : null;

  useEffect(() => {
    const target = statusConfig?.progress ?? 0.1;

    truckProgress.value = withRepeat(
      withSequence(
        withTiming(target, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
        withTiming(Math.max(0.08, target - 0.06), { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseScale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      true
    );
  }, [statusConfig?.progress]);

  const animatedTruckStyle = useAnimatedStyle(() => {
    const leftOffset = 40 + truckProgress.value * (width - 120);
    const normalized = (truckProgress.value - 0.5) * 2;
    const topOffset = 110 - (1 - normalized * normalized) * 40;

    return {
      left: leftOffset,
      top: topOffset,
    };
  });

  const animatedDestinationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const logisticsLogs = useMemo(() => {
    if (!order) return [];

    const baseLogs = [
      {
        key: 'placed',
        title: 'Order Confirmed',
        time: order.date,
        desc: 'Payment authorized and confirmation email sent.',
        step: 'Processing',
      },
      {
        key: 'processing',
        title: 'Packed at Fulfillment Center',
        time: 'Today, 9:30 AM',
        desc: 'Items were quality checked, packed, and labeled.',
        step: 'Processing',
      },
      {
        key: 'shipped',
        title: 'Departed Regional Hub',
        time: 'Today, 12:45 PM',
        desc: 'Shipment left the hub and is moving toward the destination city.',
        step: 'Shipped',
      },
      {
        key: 'delivered',
        title: 'Delivered to Saved Address',
        time: 'Today, 4:30 PM',
        desc: 'Package delivered successfully and marked complete.',
        step: 'Delivered',
      },
    ];

    const visibleSteps =
      order.status === 'Processing'
        ? ['placed', 'processing']
        : order.status === 'Shipped'
        ? ['placed', 'processing', 'shipped']
        : ['placed', 'processing', 'shipped', 'delivered'];

    return baseLogs
      .filter((log) => visibleSteps.includes(log.key))
      .reverse()
      .map((log, index) => ({ ...log, active: index === 0 }));
  }, [order]);

  const handleCallCourier = () => {
    if (!order || !statusConfig) return;

    Alert.alert(
      order.status === 'Delivered' ? 'Delivery Complete' : 'Simulate Phone Call',
      order.status === 'Delivered'
        ? 'This order has already been delivered. Need help? Open support from your profile.'
        : `Calling ${statusConfig.courier} about order ${order.id}...`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  if (!order || !statusConfig) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Tracking unavailable</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            We couldn&apos;t find that order tracking session.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.primaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Live Tracking</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="receipt-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>TRACKING ID</Text>
              <Text style={[styles.orderIdText, { color: colors.text }]}>{`LC-TX-${order.id}`}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.statusBadgeText, { color: colors.accent }]}>{statusConfig.badge}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.etaRow}>
            <Ionicons name="time-outline" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.etaLabel, { color: colors.textSecondary }]}>Current Delivery Status</Text>
              <Text style={[styles.etaTime, { color: colors.text }]}>{statusConfig.eta}</Text>
            </View>
          </View>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {statusConfig.nextStep}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Transit Route Map</Text>
        <View style={[styles.mapContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.mapPin, { left: 40, top: 110 }]}>
            <View style={[styles.pinIcon, { backgroundColor: colors.textSecondary }]}>
              <Ionicons name="business" size={14} color="#FFFFFF" />
            </View>
            <Text style={[styles.pinText, { color: colors.textSecondary }]}>Origin Hub</Text>
          </View>

          <View style={[styles.routePath, { borderColor: colors.border }]} />

          <View style={[styles.mapPin, { right: 40, top: 110 }]}>
            <Animated.View style={[styles.pinIcon, animatedDestinationStyle, { backgroundColor: colors.accent }]}>
              <Ionicons name={order.status === 'Delivered' ? 'checkmark' : 'home'} size={14} color="#FFFFFF" />
            </Animated.View>
            <Text style={[styles.pinText, { color: colors.accent, fontWeight: '700' }]}>{statusConfig.truckLabel}</Text>
          </View>

          <Animated.View style={[styles.truckSprite, animatedTruckStyle, { backgroundColor: colors.accent }]}>
            <Ionicons
              name={order.status === 'Delivered' ? 'checkmark' : order.status === 'Processing' ? 'cube-outline' : 'bicycle'}
              size={16}
              color="#FFFFFF"
            />
          </Animated.View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Partner</Text>
        <View style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.partnerInfo}>
            <View style={[styles.avatarBox, { backgroundColor: colors.border }]}>
              <Ionicons name="person" size={24} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.partnerName, { color: colors.text }]}>{statusConfig.courier}</Text>
              <Text style={[styles.partnerRole, { color: colors.textSecondary }]}>{statusConfig.courierRole}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCallCourier}
            style={[styles.callBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
            <Text style={styles.callBtnText}>{order.status === 'Delivered' ? 'View Info' : 'Call Agent'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipment Summary</Text>
        <View style={[styles.itemsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {order.items.map((item, index) => (
            <View key={`${item.product.id}-${index}`}>
              <View style={styles.itemRow}>
                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text numberOfLines={1} style={[styles.itemName, { color: colors.text }]}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
                    Qty {item.quantity}
                    {item.selectedSize ? ` • ${item.selectedSize}` : ''}
                  </Text>
                </View>
                <Text style={[styles.itemPrice, { color: colors.accent }]}>
                  {formatCurrency(item.product.price * item.quantity)}
                </Text>
              </View>
              {index < order.items.length - 1 && (
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
          <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Order Total</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(order.total)}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Logistic Logs</Text>
        <View style={styles.timelineContainer}>
          {logisticsLogs.map((log, index) => (
            <Animated.View
              key={log.key}
              entering={FadeInDown.delay(index * 100).duration(400).springify()}
              style={styles.timelineRow}
            >
              <View style={styles.timelineIndicator}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: log.active ? colors.accent : colors.border,
                      shadowColor: log.active ? colors.accent : 'transparent',
                    },
                  ]}
                />
                {index < logisticsLogs.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                )}
              </View>
              <View style={styles.timelineBody}>
                <View style={styles.timelineHeaderRow}>
                  <Text
                    style={[
                      styles.logTitle,
                      { color: log.active ? colors.text : colors.textSecondary, fontWeight: log.active ? '700' : '600' },
                    ]}
                  >
                    {log.title}
                  </Text>
                  <Text style={[styles.logTime, { color: colors.textSecondary }]}>{log.time}</Text>
                </View>
                <Text style={[styles.logDesc, { color: colors.textSecondary }]}>{log.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  divider: {
    height: 1,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  etaLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  etaTime: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 10,
  },
  mapContainer: {
    height: 190,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  pinIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinText: {
    fontSize: 9,
    fontWeight: '600',
  },
  routePath: {
    position: 'absolute',
    left: 60,
    right: 60,
    top: 124,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    zIndex: 1,
  },
  truckSprite: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  partnerRole: {
    fontSize: 11,
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  itemsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  itemImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemMeta: {
    fontSize: 11,
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemDivider: {
    height: 1,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  timelineContainer: {
    paddingLeft: 4,
    gap: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    marginVertical: 4,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 20,
    gap: 4,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 13,
  },
  logTime: {
    fontSize: 10,
  },
  logDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  errorSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
  primaryBtn: {
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
