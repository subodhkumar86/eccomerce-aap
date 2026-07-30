import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

export default function CheckoutSuccessScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { orders } = useStore();

  const lastOrder = orders[0];
  const orderId = lastOrder ? lastOrder.id : '#LC-980415';

  const handleHomePress = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          entering={ZoomIn.duration(600).springify().damping(12)}
          style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}
        >
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </Animated.View>

        {/* Message */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify()}
          style={styles.textContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>Order Confirmed!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your payment was processed successfully. We have sent a confirmation email with details of your order.
          </Text>
        </Animated.View>

        {/* Mock Order Details Card */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(500).springify()}
          style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Order ID</Text>
            <Text style={[styles.value, { color: colors.text }]}>{orderId}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Delivery Estimate</Text>
            <Text style={[styles.value, { color: colors.text }]}>2 - 4 Business Days</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Delivery Method</Text>
            <Text style={[styles.value, { color: colors.text }]}>Premium Insured Courier</Text>
          </View>
        </Animated.View>

        {/* Buttons Row */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(500).springify()}
          style={styles.btnRow}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleHomePress}
            style={[styles.homeBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.homeBtnText}>Continue Shopping</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {lastOrder && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/orders/track', params: { id: lastOrder.id } })}
              style={[styles.trackBtn, { borderColor: colors.accent, borderWidth: 1 }]}
            >
              <Text style={[styles.trackBtnText, { color: colors.accent }]}>Track Order</Text>
              <Ionicons name="navigate-outline" size={18} color={colors.accent} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 30,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  detailsCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  btnRow: {
    width: '100%',
    gap: 10,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
    borderRadius: 14,
    gap: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
    borderRadius: 14,
    gap: 8,
  },
  trackBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
