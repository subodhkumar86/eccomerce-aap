import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

export default function PromoScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { orders, showToast } = useStore();

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const vipUnlockThreshold = 500;
  const eliteUnlockThreshold = 800;

  const progress = Math.min(totalSpent / eliteUnlockThreshold, 1);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, { damping: 15, stiffness: 80 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const coupons = [
    {
      code: 'LUX30',
      discount: '30% OFF',
      desc: 'Save 30% on all premium audio and lifestyle products.',
      minSpent: 0,
      unlocked: true,
    },
    {
      code: 'NEW20',
      discount: '20% OFF',
      desc: 'Exclusive discount code valid on your entire shopping cart.',
      minSpent: 0,
      unlocked: true,
    },
    {
      code: 'FREESHIP',
      discount: 'FREE SHIPPING',
      desc: 'Eliminates shipping and carrier handling fees.',
      minSpent: 0,
      unlocked: true,
    },
    {
      code: 'VIP50',
      discount: '50% OFF',
      desc: 'VIP Gold level access. Valid on all 30 luxury catalogue items.',
      minSpent: vipUnlockThreshold,
      unlocked: totalSpent >= vipUnlockThreshold,
    },
    {
      code: 'ELITE100',
      discount: `${formatCurrency(100)} OFF`,
      desc: `Elite level coupon. Takes ${formatCurrency(100)} off when cart total exceeds ${formatCurrency(300)}.`,
      minSpent: eliteUnlockThreshold,
      unlocked: totalSpent >= eliteUnlockThreshold,
    },
  ];

  const handleCopyCoupon = (code: string) => {
    showToast(`Coupon ${code} copied! Paste it in your cart.`, 'success');
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Coupons & Rewards</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.progressHeader}>
            <View style={styles.badgeRow}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text style={[styles.progressTitle, { color: colors.text }]}>Luxe Loyalty Status</Text>
            </View>
            <Text style={[styles.spentText, { color: colors.accent }]}>{formatCurrency(totalSpent)} Spent</Text>
          </View>

          <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
            Spend more to unlock premium VIP coupons and discounts.
          </Text>

          <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
            <Animated.View style={[styles.progressBarFill, animatedProgressStyle, { backgroundColor: colors.accent }]} />
          </View>

          <View style={styles.tiersRow}>
            <Text style={[styles.tierLabel, { color: colors.textSecondary }]}>Starter</Text>
            <Text style={[styles.tierLabel, { color: totalSpent >= vipUnlockThreshold ? colors.text : colors.textSecondary }]}>
              VIP ({formatCurrency(vipUnlockThreshold)})
            </Text>
            <Text style={[styles.tierLabel, { color: totalSpent >= eliteUnlockThreshold ? colors.text : colors.textSecondary }]}>
              Elite ({formatCurrency(eliteUnlockThreshold)})
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400).springify()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/promo/spin' as any)}
            style={[styles.spinBanner, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}
          >
            <View style={styles.spinBannerLeft}>
              <Ionicons name="gift" size={24} color={colors.accent} />
              <View>
                <Text style={[styles.spinBannerTitle, { color: colors.accent }]}>Feeling Lucky?</Text>
                <Text style={[styles.spinBannerSubtitle, { color: colors.textSecondary }]}>Spin the daily wheel to win instant discounts!</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.accent} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400).springify()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/promo/scratch' as any)}
            style={[styles.spinBanner, { backgroundColor: colors.success + '15', borderColor: colors.success, marginTop: 10 }]}
          >
            <View style={styles.spinBannerLeft}>
              <Ionicons name="sparkles" size={24} color={colors.success} />
              <View>
                <Text style={[styles.spinBannerTitle, { color: colors.success }]}>Lucky Scratch Card</Text>
                <Text style={[styles.spinBannerSubtitle, { color: colors.textSecondary }]}>Scratch the silver card to win 40% OFF coupons!</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.success} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Promo Codes</Text>
        <View style={styles.couponsContainer}>
          {coupons.map((coupon, index) => (
            <Animated.View
              key={coupon.code}
              entering={FadeInDown.delay(index * 100).duration(400).springify()}
              style={[
                styles.couponCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: coupon.unlocked ? 1 : 0.65,
                },
              ]}
            >
              <View style={styles.couponLeft}>
                <View style={styles.scissorsLine} />
                <View style={[styles.scissorsIcon, { backgroundColor: colors.background }]}>
                  <Ionicons name="cut" size={12} color={colors.textSecondary} />
                </View>
              </View>

              <View style={styles.couponMain}>
                <View style={styles.couponHeader}>
                  <Text style={[styles.couponDiscount, { color: coupon.unlocked ? colors.accent : colors.textSecondary }]}>
                    {coupon.discount}
                  </Text>
                  {!coupon.unlocked && (
                    <View style={styles.lockBadge}>
                      <Ionicons name="lock-closed" size={10} color="#EF4444" style={{ marginRight: 2 }} />
                      <Text style={styles.lockBadgeText}>Locked</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.couponCode, { color: colors.text }]}>{coupon.code}</Text>
                <Text style={[styles.couponDesc, { color: colors.textSecondary }]}>{coupon.desc}</Text>

                {coupon.unlocked ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleCopyCoupon(coupon.code)}
                    style={[styles.copyBtn, { backgroundColor: colors.accent }]}
                  >
                    <Text style={styles.copyBtnText}>Copy & Use Code</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.lockStatus, { backgroundColor: colors.background }]}>
                    <Text style={[styles.lockStatusText, { color: colors.textSecondary }]}>
                      Spend {formatCurrency(coupon.minSpent - totalSpent)} more to unlock
                    </Text>
                  </View>
                )}
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
    gap: 20,
    paddingBottom: 40,
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  spentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressSubtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tiersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  couponsContainer: {
    gap: 16,
  },
  couponCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 120,
  },
  couponLeft: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scissorsLine: {
    position: 'absolute',
    left: 11,
    top: 0,
    bottom: 0,
    width: 1,
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
  },
  scissorsIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  couponMain: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponDiscount: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockBadgeText: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '700',
  },
  couponCode: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  couponDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  copyBtn: {
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  lockStatus: {
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockStatusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  spinBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 10,
  },
  spinBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  spinBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  spinBannerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});
