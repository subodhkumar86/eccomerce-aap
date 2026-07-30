import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

const GRID_ROWS = 8;
const GRID_COLS = 8;
const TOTAL_BLOCKS = GRID_ROWS * GRID_COLS;

export default function ScratchCardScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { showToast } = useStore();
  const { width } = useWindowDimensions();

  // Responsive dynamic sizes
  const CARD_WIDTH = Math.min(width - 48, 320);
  const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.64);
  const BLOCK_WIDTH = CARD_WIDTH / GRID_COLS;
  const BLOCK_HEIGHT = CARD_HEIGHT / GRID_ROWS;

  const [scratchedBlocks, setScratchedBlocks] = useState<boolean[]>(
    Array(TOTAL_BLOCKS).fill(false)
  );
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const couponCode = 'SCRATCH40';
  const [copied, setCopied] = useState(false);
  const [attempts, setAttempts] = useState(3);

  const cardPositionRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  });

  const cardScale = useSharedValue(1);
  const animCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleLayout = (event: any) => {
    // Save relative position to calculate touch points
    event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      cardPositionRef.current = {
        x: pageX,
        y: pageY,
        width,
        height,
      };
    });
  };

  const handleTouch = (pageX: number, pageY: number) => {
    if (isRevealed || attempts === 0) return;

    const { x, y, width, height } = cardPositionRef.current;
    
    // Relative coordinates on the card
    const relX = pageX - x;
    const relY = pageY - y;

    // Check if touch is inside card boundary
    if (relX >= 0 && relX <= width && relY >= 0 && relY <= height) {
      // Calculate row and column index
      const col = Math.floor((relX / width) * GRID_COLS);
      const row = Math.floor((relY / height) * GRID_ROWS);
      const blockIdx = row * GRID_COLS + col;

      if (blockIdx >= 0 && blockIdx < TOTAL_BLOCKS && !scratchedBlocks[blockIdx]) {
        // Mark block as scratched
        const updated = [...scratchedBlocks];
        updated[blockIdx] = true;
        setScratchedBlocks(updated);

        // Calculate percentage scratched
        const count = updated.filter(Boolean).length;
        const percent = Math.round((count / TOTAL_BLOCKS) * 100);
        setScratchedPercent(percent);

        // Auto-reveal if 65%+ is scratched
        if (percent >= 65) {
          triggerReveal();
        }
      }
    }
  };

  const triggerReveal = () => {
    setIsRevealed(true);
    cardScale.value = withSpring(1.05, { damping: 8, stiffness: 120 }, () => {
      cardScale.value = withSpring(1);
    });
    showToast('Congratulations! Coupon revealed.', 'success');
  };

  const handleCopyCode = () => {
    Clipboard.setString(couponCode);
    setCopied(true);
    showToast('Coupon SCRATCH40 copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (attempts <= 1) {
      setAttempts(0);
      showToast('No more scratch attempts left today!', 'error');
      return;
    }
    setAttempts((prev) => prev - 1);
    setScratchedBlocks(Array(TOTAL_BLOCKS).fill(false));
    setScratchedPercent(0);
    setIsRevealed(false);
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Lucky Scratch Card</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={[styles.title, { color: colors.text }]}>Scratch & Win Big!</Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            Use your finger to scratch the silver overlay on the card and reveal a premium checkout discount.
          </Text>

          <View style={[styles.attemptsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ fontSize: 13, color: colors.text, fontWeight: '600' }}>Attempts Remaining Today</Text>
            <Text style={{ fontSize: 18, color: colors.accent, fontWeight: '800' }}>{attempts} left</Text>
          </View>
        </View>

        {/* Scratch Card Interactive Area */}
        <View style={styles.cardContainer}>
          <Animated.View
            onLayout={handleLayout}
            onTouchStart={(e) => handleTouch(e.nativeEvent.pageX, e.nativeEvent.pageY)}
            onTouchMove={(e) => handleTouch(e.nativeEvent.pageX, e.nativeEvent.pageY)}
            style={[
              styles.card,
              animCardStyle,
              {
                backgroundColor: colors.card,
                borderColor: colors.text,
                shadowColor: colors.text,
              },
            ]}
          >
            {/* Background Layer: Coupon Code Details */}
            <View style={[styles.couponDetails, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="gift-outline" size={28} color={colors.accent} />
              <Text style={[styles.discountValue, { color: colors.accent }]}>40% OFF</Text>
              <Text style={[styles.couponCodeText, { color: colors.text }]}>Code: {couponCode}</Text>
              <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 4 }}>
                Storewide mystery discount
              </Text>
            </View>

             {/* Foreground Layer: Silver Scratch Blocks */}
            {!isRevealed && (
              <View style={[styles.overlayGrid, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
                {scratchedBlocks.map((scratched, index) => (
                  <View
                    key={index}
                    style={[
                      styles.gridBlock,
                      {
                        width: BLOCK_WIDTH,
                        height: BLOCK_HEIGHT,
                        backgroundColor: scratched ? 'transparent' : '#CBD5E1',
                        borderColor: scratched ? 'transparent' : '#94A3B8',
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Completed Reveal Mask */}
            {isRevealed && (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.scratchOverlayText}>
                <Ionicons name="sparkles" size={24} color={colors.accent} />
              </Animated.View>
            )}
          </Animated.View>

          {/* Progress bar */}
          {!isRevealed && attempts > 0 && (
            <View style={[styles.progressContainer, { width: CARD_WIDTH }]}>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Scratched: {scratchedPercent}% (Need 65% for auto-reveal)
              </Text>
              <View style={[styles.progressBarOuter, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressBarInner,
                    {
                      width: `${scratchedPercent}%`,
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Card Actions */}
        <View style={styles.actionSection}>
          {isRevealed ? (
            <Animated.View entering={FadeInDown} style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCopyCode}
                style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
              >
                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="#FFFFFF" />
                <Text style={styles.btnText}>{copied ? 'Copied!' : 'Copy Coupon Code'}</Text>
              </TouchableOpacity>

              {attempts > 1 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleReset}
                  style={[styles.secondaryBtn, { borderColor: colors.border, borderWidth: 1 }]}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' }}>Scratch Another Card</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          ) : (
            attempts > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={triggerReveal}
                style={[styles.secondaryBtn, { borderColor: colors.accent, borderWidth: 1 }]}
              >
                <Text style={{ color: colors.accent, fontWeight: '700' }}>Give Up & Reveal</Text>
              </TouchableOpacity>
            )
          )}

          {attempts === 0 && (
            <View style={styles.finishedMessage}>
              <Ionicons name="lock-closed" size={24} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 5 }}>
                You have reached your scratch card limit for today. Come back tomorrow!
              </Text>
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoSection: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  attemptsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  couponDetails: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  discountValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  couponCodeText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  overlayGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridBlock: {
    borderWidth: 0.5,
  },
  scratchOverlayText: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  progressContainer: {
    gap: 6,
    alignItems: 'center',
  },
  progressBarOuter: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: 3,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
    borderRadius: 14,
    gap: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 52,
    width: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedMessage: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});
