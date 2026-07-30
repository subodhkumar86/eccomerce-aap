import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

const ONBOARDING_SLIDES = [
  {
    id: 's1',
    title: 'CURATED LUXURY',
    desc: 'Explore our hand-picked collection of premium mechanical keyboards, audiophile accessories, and lifestyle essentials.',
    icon: 'cube-outline',
    color: '#D97706',
  },
  {
    id: 's2',
    title: 'LUCKY REWARDS',
    desc: 'Play daily games like Lucky Spin and Scratch Cards to unlock exclusive discount coupons and loyalty prizes.',
    icon: 'gift-outline',
    color: '#10B981',
  },
  {
    id: 's3',
    title: 'PREMIUM COURIER',
    desc: 'Enjoy rapid insured shipping on all orders with real-time status updates and delivery tracking maps.',
    icon: 'navigate-outline',
    color: '#3B82F6',
  },
];

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<'loading' | 'onboarding'>('loading');
  const [slideIndex, setSlideIndex] = useState(0);

  // Loading animation shared values
  const outerRotation = useSharedValue(0);
  const middleRotation = useSharedValue(0);
  const innerRotation = useSharedValue(0);
  const starRotation = useSharedValue(0);
  const rippleScale = useSharedValue(0.8);
  const rippleOpacity = useSharedValue(0.6);
  const coreScale = useSharedValue(1);
  const textSpacing = useSharedValue(4);
  const brandOpacity = useSharedValue(0);
  const shimmerWidth = useSharedValue(0);
  const onboardingOpacity = useSharedValue(0);

  // Overall container animations
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Hide native splash screen
    SplashScreen.hideAsync().catch(() => {});

    // Outer Ring Z-axis clockwise
    outerRotation.value = withRepeat(
      withTiming(360, { duration: 1800, easing: Easing.linear }),
      -1,
      false
    );

    // Middle Ring Y-axis counter-clockwise
    middleRotation.value = withRepeat(
      withTiming(-360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );

    // Inner Ring X-axis clockwise
    innerRotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );

    // Star orbit rotation
    starRotation.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );

    // Sonar Ripple wave
    rippleScale.value = withRepeat(
      withTiming(1.6, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    rippleOpacity.value = withRepeat(
      withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );

    // Core heartbeat pulse
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.9, { duration: 600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Title text spacing expansion
    brandOpacity.value = withTiming(1, { duration: 800 });
    textSpacing.value = withTiming(14, { duration: 2000, easing: Easing.out(Easing.quad) });

    // Shimmer gold line expanding
    shimmerWidth.value = withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) });

    // Transition to onboarding after loading completes
    const timer = setTimeout(() => {
      setStage('onboarding');
      onboardingOpacity.value = withTiming(1, { duration: 600 });
    }, 3200);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animated styles
  const animOuterStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRotation.value}deg` }],
  }));

  const animMiddleStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 200 },
      { rotateX: '60deg' },
      { rotateY: `${middleRotation.value}deg` },
    ],
  }));

  const animInnerStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 200 },
      { rotateY: '60deg' },
      { rotateX: `${innerRotation.value}deg` },
    ],
  }));

  const animStarStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotation.value}deg` }],
  }));

  const animRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const animCoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));

  const animTitleStyle = useAnimatedStyle(() => ({
    letterSpacing: textSpacing.value,
    opacity: brandOpacity.value,
  }));

  const animShimmerStyle = useAnimatedStyle(() => ({
    width: `${shimmerWidth.value * 80}%`,
  }));

  const animContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const animOnboardingStyle = useAnimatedStyle(() => ({
    opacity: onboardingOpacity.value,
  }));

  const handleFinishOnboarding = () => {
    containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    });
  };

  const handleNextSlide = () => {
    if (slideIndex < ONBOARDING_SLIDES.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.splashOverlay, animContainerStyle, { backgroundColor: '#0B0F19' }]}>
      {stage === 'loading' ? (
        <Animated.View exiting={FadeOut.duration(400)} style={styles.loadingContainer}>
          {/* Animated Glow Aura */}
          <View style={styles.glowAura} />

          {/* Gyroscopic Concentric Orbit Loader */}
          <View style={styles.loaderWrapper}>
            {/* Sonar Ripple Halo */}
            <Animated.View style={[styles.rippleRing, animRippleStyle]} />

            {/* Orbiting Golden Stars Container */}
            <Animated.View style={[styles.starsOrbitContainer, animStarStyle]}>
              <View style={[styles.orbitStar, { top: -8, left: 60 - 6 }]}><Ionicons name="star" size={10} color="#D97706" /></View>
              <View style={[styles.orbitStar, { bottom: -8, left: 60 - 6 }]}><Ionicons name="star" size={10} color="#D97706" /></View>
              <View style={[styles.orbitStar, { left: -8, top: 60 - 6 }]}><Ionicons name="star" size={10} color="#D97706" /></View>
              <View style={[styles.orbitStar, { right: -8, top: 60 - 6 }]}><Ionicons name="star" size={10} color="#D97706" /></View>
            </Animated.View>

            {/* Outer Clockwise Thin Z-Ring */}
            <Animated.View style={[styles.outerRing, animOuterStyle]} />
            
            {/* Middle Y-Axis Orbit Ring */}
            <Animated.View style={[styles.middleRing, animMiddleStyle]} />

            {/* Inner X-Axis Orbit Ring */}
            <Animated.View style={[styles.innerRing, animInnerStyle]} />

            {/* Pulsing Core */}
            <Animated.View style={[styles.innerCore, animCoreStyle]}>
              <Ionicons name="sparkles" size={26} color="#D97706" />
            </Animated.View>
          </View>

          {/* Cinematic Branding Typography */}
          <View style={styles.brandTextContainer}>
            <Animated.Text style={[styles.brandTitle, animTitleStyle]}>
              LUXECART
            </Animated.Text>
            {/* Shimmer Gold Line */}
            <Animated.View style={[styles.shimmerLine, animShimmerStyle]} />
            <Text style={styles.brandSubtitle}>
              CURATING WORKSPACE ELEGANCE
            </Text>
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(500)} style={[styles.onboardingContainer, animOnboardingStyle]}>
          {/* Top skip link */}
          <TouchableOpacity activeOpacity={0.8} onPress={handleFinishOnboarding} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>

          {/* Core onboarding tour slider card */}
          <View style={[styles.carouselCard, { backgroundColor: '#111827', borderColor: '#1F2937' }]}>
            <View style={styles.slideContent}>
              <Animated.View
                key={slideIndex}
                entering={SlideInRight.duration(400)}
                exiting={SlideOutLeft.duration(400)}
                style={styles.slideAnimatedInner}
              >
                <View style={[styles.slideIconBox, { backgroundColor: ONBOARDING_SLIDES[slideIndex].color + '20' }]}>
                  <Ionicons
                    name={ONBOARDING_SLIDES[slideIndex].icon as any}
                    size={48}
                    color={ONBOARDING_SLIDES[slideIndex].color}
                  />
                </View>
                <Text style={styles.slideTitle}>{ONBOARDING_SLIDES[slideIndex].title}</Text>
                <Text style={styles.slideDesc}>{ONBOARDING_SLIDES[slideIndex].desc}</Text>
              </Animated.View>
            </View>

            {/* Pagination dots indicator */}
            <View style={styles.dotsRow}>
              {ONBOARDING_SLIDES.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: slideIndex === idx ? '#D97706' : '#374151',
                      width: slideIndex === idx ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextSlide}
            style={[styles.actionBtn, { backgroundColor: '#D97706' }]}
          >
            <Text style={styles.actionBtnText}>
              {slideIndex === ONBOARDING_SLIDES.length - 1 ? 'Begin Experience' : 'Next'}
            </Text>
            <Ionicons
              name={slideIndex === ONBOARDING_SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name="sparkles" size={24} color="#D97706" />
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  glowAura: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#D97706',
    opacity: 0.04,
  },
  loaderWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  middleRing: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  innerRing: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderStyle: 'dashed',
    borderLeftColor: 'transparent',
  },
  rippleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(217, 119, 6, 0.5)',
  },
  starsOrbitContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  orbitStar: {
    position: 'absolute',
  },
  shimmerLine: {
    height: 1.5,
    backgroundColor: '#D97706',
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 1,
  },
  innerCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  brandTextContainer: {
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  brandSubtitle: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  onboardingContainer: {
    flex: 1,
    width: '100%',
    padding: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  skipBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  carouselCard: {
    width: '100%',
    maxWidth: 320,
    height: 350,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  slideContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  slideAnimatedInner: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  slideIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  slideTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  slideDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
