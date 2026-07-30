import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

const SEGMENTS = [
  { label: '5% OFF', code: 'SPIN5' },
  { label: 'Free Ship', code: 'SPINSHIP' },
  { label: '10% OFF', code: 'SPIN10' },
  { label: 'Try Again', code: '' },
  { label: '15% OFF', code: 'SPIN15' },
  { label: 'VIP Gift', code: 'SPINVIP' },
];

export default function SpinWheelScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { showToast } = useStore();
  const { width } = useWindowDimensions();
  const WHEEL_SIZE = Math.min(width * 0.8, 300);

  const [spinning, setSpinning] = useState(false);
  const [winItem, setWinItem] = useState<string | null>(null);
  const [winCode, setWinCode] = useState<string | null>(null);
  const [spinHistory, setSpinHistory] = useState<string[]>([]);

  const rotation = useSharedValue(0);
  const remainingAttempts = Math.max(3 - spinHistory.length, 0);

  const startSpin = () => {
    if (spinning || remainingAttempts === 0) return;

    setSpinning(true);
    setWinItem(null);
    setWinCode(null);

    const rounds = 5 + Math.floor(Math.random() * 4);
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rounds * 360 + randomAngle;

    rotation.value = 0;
    rotation.value = withTiming(
      totalRotation,
      {
        duration: 4000,
        easing: Easing.out(Easing.quad),
      },
      (finished) => {
        if (finished) {
          runOnJS(calculateWinningSegment)(randomAngle);
        }
      }
    );
  };

  const calculateWinningSegment = (angle: number) => {
    const normalizedAngle = (360 - (angle % 360)) % 360;
    const adjustedAngle = (normalizedAngle + 90) % 360;
    const segmentIndex = Math.floor(adjustedAngle / 60) % 6;
    const result = SEGMENTS[segmentIndex];

    setSpinning(false);
    setWinItem(result.label);
    setWinCode(result.code || null);
    setSpinHistory((prev) => [result.label, ...prev].slice(0, 3));

    if (result.code) {
      showToast(`Congratulations! You won ${result.label}`, 'success');
    } else {
      showToast('No reward this time. You still have more spins left today.', 'info');
    }
  };

  const wheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const wheelSegments = useMemo(
    () =>
      SEGMENTS.map((segment, index) => ({
        ...segment,
        rotateDeg: index * 60,
      })),
    []
  );

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Lucky Spin Wheel</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.topContent}>
          <Text style={[styles.title, { color: colors.text }]}>Spin & Win Rewards</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Try your luck up to three times today and unlock extra savings for checkout.
          </Text>

          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statsTitle, { color: colors.text }]}>Today&apos;s Attempts</Text>
            <Text style={[styles.statsValue, { color: colors.accent }]}>{remainingAttempts} remaining</Text>
          </View>
        </View>

        <View style={[styles.wheelWrapper, { width: WHEEL_SIZE, height: WHEEL_SIZE }]}>
          <View style={styles.pointerContainer}>
            <Ionicons name="caret-down" size={36} color={colors.accent} />
          </View>

          <Animated.View style={[styles.wheel, wheelAnimatedStyle, { borderColor: colors.text, width: WHEEL_SIZE, height: WHEEL_SIZE, borderRadius: WHEEL_SIZE / 2 }]}>
            {wheelSegments.map((segment) => (
              <View
                key={segment.code || segment.label}
                style={[
                  styles.segment,
                  {
                    transform: [{ rotate: `${segment.rotateDeg}deg` }],
                    borderRightColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.segmentText, { color: colors.text }]}>{segment.label}</Text>
              </View>
            ))}
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={startSpin}
            disabled={spinning || remainingAttempts === 0}
            style={[
              styles.spinButton,
              {
                backgroundColor: remainingAttempts === 0 ? colors.textSecondary : colors.accent,
              },
            ]}
          >
            <Text style={styles.spinButtonText}>{spinning ? '...' : 'SPIN'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {winItem ? (
            winCode ? (
              <View style={styles.winBox}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
                <Text style={[styles.winTitle, { color: colors.text }]}>You Won: {winItem}</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => showToast(`Code ${winCode} copied!`, 'success')}
                  style={[styles.copyBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={styles.copyBtnText}>Copy Code: {winCode}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.winBox}>
                <Ionicons name="refresh-circle" size={24} color={colors.textSecondary} />
                <Text style={[styles.winTitle, { color: colors.text }]}>Better luck next time</Text>
              </View>
            )
          ) : (
            <View style={styles.winBox}>
              <Ionicons name="gift-outline" size={24} color={colors.accent} />
              <Text style={[styles.winTitle, { color: colors.text }]}>Your reward will appear here</Text>
            </View>
          )}
        </View>

        <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Spins</Text>
          {spinHistory.length === 0 ? (
            <Text style={[styles.historyEmpty, { color: colors.textSecondary }]}>
              No spins yet today.
            </Text>
          ) : (
            spinHistory.map((item, index) => (
              <Text key={`${item}-${index}`} style={[styles.historyItem, { color: colors.textSecondary }]}>
                {index + 1}. {item}
              </Text>
            ))
          )}
        </View>
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topContent: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  statsCard: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  wheelWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  pointerContainer: {
    position: 'absolute',
    top: -24,
    zIndex: 10,
  },
  wheel: {
    borderWidth: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF10',
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  spinButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'absolute',
    zIndex: 11,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  winBox: {
    alignItems: 'center',
    gap: 8,
  },
  winTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  copyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  historyCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyEmpty: {
    fontSize: 12,
  },
  historyItem: {
    fontSize: 12,
    lineHeight: 18,
  },
});
