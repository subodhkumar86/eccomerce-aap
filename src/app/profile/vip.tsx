import React, { useState } from 'react';
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
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

export default function VIPCardScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { orders } = useStore();

  const [flipped, setFlipped] = useState(false);
  const rotateValue = useSharedValue(0);

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const isGold = totalSpent >= 500;
  const isElite = totalSpent >= 800;

  const tierName = isElite ? 'VIP Elite' : isGold ? 'VIP Gold' : 'Luxe Starter';
  const nextTierTarget = isElite ? 800 : isGold ? 800 : 500;
  const amountRemaining = Math.max(nextTierTarget - totalSpent, 0);
  const progress = isElite ? 1 : Math.min(totalSpent / nextTierTarget, 1);

  const tierGradient = isElite
    ? ['#1E293B', '#0F172A']
    : isGold
    ? ['#78350F', '#B45309']
    : ['#1E3A8A', '#2563EB'];

  const handleFlipCard = () => {
    const toValue = flipped ? 0 : 180;
    rotateValue.value = withSpring(toValue, { damping: 14, stiffness: 90 });
    setFlipped(!flipped);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotateValue.value, [0, 180], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${spin}deg` }],
      opacity: rotateValue.value <= 90 ? 1 : 0,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(rotateValue.value, [0, 180], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${spin}deg` }],
      opacity: rotateValue.value > 90 ? 1 : 0,
    };
  });

  const perks = [
    { icon: 'time-outline', title: 'Priority Dispatch', desc: 'Orders are prioritized and dispatched within 12 hours.' },
    { icon: 'shield-checkmark-outline', title: 'Complimentary Insurance', desc: 'Parcels are covered against loss, theft, and transit damage.' },
    { icon: 'headset-outline', title: '24/7 Concierge Hotline', desc: 'Priority response times across every customer support channel.' },
    { icon: 'sparkles-outline', title: 'Exclusive Product Drops', desc: 'Early access to seasonal drops and members-only releases.' },
  ];

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Luxe Member Wallet</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.guideText, { color: colors.textSecondary }]}>
          Tap the card to reveal your member pass and security barcode.
        </Text>

        <TouchableOpacity activeOpacity={1} onPress={handleFlipCard} style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              frontAnimatedStyle,
              { backgroundColor: tierGradient[0] },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.brandText}>LuxeCart</Text>
              <Ionicons name="sparkles" size={20} color="#F59E0B" />
            </View>
            <View style={styles.cardMiddle}>
              <Text style={styles.chipText}>MEMBERSHIP ACCESS CHIP</Text>
              <View style={styles.chipGraphic} />
            </View>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardHolderLabel}>MEMBER TIER</Text>
                <Text style={styles.cardHolderName}>{tierName}</Text>
              </View>
              <View style={styles.tierTag}>
                <Text style={styles.tierTagText}>ACTIVE</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              backAnimatedStyle,
              { backgroundColor: tierGradient[1] },
            ]}
          >
            <View style={styles.magneticStrip} />
            <View style={styles.backHeader}>
              <Text style={styles.backHeaderText}>Security Passcode: VIP-98041</Text>
            </View>
            <View style={styles.barcodeContainer}>
              <View style={styles.barcodeLineRow}>
                {Array.from({ length: 28 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.barcodeLine,
                      {
                        width: index % 3 === 0 ? 3 : index % 2 === 0 ? 1 : 2,
                        marginRight: index % 4 === 0 ? 3 : 1,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.barcodeText}>* MEMBER-980-415 *</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Loyalty Progress</Text>
            <Text style={[styles.progressAmount, { color: colors.accent }]}>{formatCurrency(totalSpent)}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${progress * 100}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {isElite
              ? 'You have reached the highest membership tier.'
              : `${formatCurrency(amountRemaining)} more to unlock ${isGold ? 'VIP Elite' : 'VIP Gold'}.`}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Member Privileges</Text>
        <View style={styles.perksList}>
          {perks.map((perk, index) => (
            <Animated.View
              key={perk.title}
              entering={FadeInDown.delay(index * 100).duration(400).springify()}
              style={[styles.perkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.accentLight }]}>
                <Ionicons name={perk.icon as any} size={18} color={colors.accent} />
              </View>
              <View style={styles.perkInfo}>
                <Text style={[styles.perkTitle, { color: colors.text }]}>{perk.title}</Text>
                <Text style={[styles.perkDesc, { color: colors.textSecondary }]}>{perk.desc}</Text>
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
    gap: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  guideText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 1.586,
    position: 'relative',
    marginBottom: 10,
    maxWidth: 360,
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 2,
    paddingTop: 45,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardMiddle: {
    gap: 6,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  chipGraphic: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    opacity: 0.85,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontWeight: '600',
  },
  cardHolderName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tierTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  magneticStrip: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#000000',
  },
  backHeader: {
    width: '100%',
    alignItems: 'flex-start',
  },
  backHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  barcodeContainer: {
    width: '80%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    gap: 4,
  },
  barcodeLineRow: {
    flexDirection: 'row',
    height: 22,
    alignItems: 'stretch',
  },
  barcodeLine: {
    backgroundColor: '#000000',
  },
  barcodeText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#000000',
  },
  progressCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  perksList: {
    width: '100%',
    gap: 12,
  },
  perkCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  perkInfo: {
    flex: 1,
    gap: 2,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  perkDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
});
