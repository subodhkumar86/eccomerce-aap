import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

export default function ToastOverlay() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const insets = useSafeAreaInsets();
  const { toast } = useStore();

  const translateY = useSharedValue(-150);

  useEffect(() => {
    if (toast.visible) {
      // Spring down to viewport
      translateY.value = withSpring(insets.top + 10, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      // Slide back up offscreen
      translateY.value = withTiming(-150, { duration: 250 });
    }
  }, [toast.visible, insets.top]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={20} color="#10B981" />;
      case 'error':
        return <Ionicons name="alert-circle" size={20} color="#EF4444" />;
      case 'info':
      default:
        return <Ionicons name="information-circle" size={20} color={colors.accent} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        animatedStyle,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#0F172A',
        },
      ]}
    >
      <View style={styles.contentRow}>
        {getIcon()}
        <Text numberOfLines={2} style={[styles.toastText, { color: colors.text }]}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    ...Platform.select({
      web: {
        maxWidth: 400,
        alignSelf: 'center',
        left: 'auto',
        right: 'auto',
        width: '90%',
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
