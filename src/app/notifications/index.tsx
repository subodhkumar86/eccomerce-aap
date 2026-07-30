import React, { useMemo, useState } from 'react';
import {
  FlatList,
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
  LinearTransition,
  SlideOutLeft,
} from 'react-native-reanimated';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';

interface NotificationItem {
  id: string;
  type: 'order' | 'promo' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  route?: '/promo' | '/support' | '/orders/track';
  params?: Record<string, string>;
}

export default function NotificationsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      type: 'order',
      title: 'Order Handed to Carrier',
      message: 'Your order LC-892014 is now in transit and ready for live tracking.',
      time: '2 hours ago',
      read: false,
      route: '/orders/track',
      params: { id: 'LC-892014' },
    },
    {
      id: 'n2',
      type: 'promo',
      title: 'VIP Gold Status Unlocked',
      message: `You crossed ${formatCurrency(500)} in lifetime spend. Use VIP50 to claim 50% OFF.`,
      time: '1 day ago',
      read: false,
      route: '/promo',
    },
    {
      id: 'n3',
      type: 'system',
      title: 'Free Shipping Reminder',
      message: `Orders above ${formatCurrency(200)} qualify for complimentary shipping.`,
      time: '3 days ago',
      read: true,
      route: '/support',
    },
  ]);

  const filteredNotifications = useMemo(() => {
    return activeFilter === 'unread'
      ? notifications.filter((item) => !item.read)
      : notifications;
  }, [activeFilter, notifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const openNotification = (item: NotificationItem) => {
    toggleRead(item.id);

    if (!item.route) {
      return;
    }

    if (item.params) {
      router.push({ pathname: item.route, params: item.params } as any);
      return;
    }

    router.push(item.route as any);
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return 'cube';
      case 'promo':
        return 'gift';
      case 'system':
        return 'information-circle';
    }
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
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notification Center</Text>
          <Text style={[styles.headerMeta, { color: colors.textSecondary }]}>
            {unreadCount} unread
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={markAllRead}
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="checkmark-done" size={18} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.filterRow}>
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
        ].map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(filter.id as 'all' | 'unread')}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? colors.accentLight : colors.card,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: active ? colors.accent : colors.textSecondary },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingTop: 80 }}>
            <AnimatedEmptyState
              icon="notifications-off-outline"
              title="All caught up"
              description="No new updates right now. Order alerts and VIP promos will land here."
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 80).duration(350).springify()}
            exiting={SlideOutLeft.duration(200)}
            layout={LinearTransition.springify().damping(14)}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => openNotification(item)}
              style={[
                styles.notiCard,
                {
                  backgroundColor: item.read ? colors.card : colors.backgroundElement,
                  borderColor: item.read ? colors.border : colors.accent,
                },
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name={getIcon(item.type) as any} size={16} color={colors.accent} />
              </View>

              <View style={styles.notiMain}>
                <View style={styles.notiHeader}>
                  <Text style={[styles.notiTitle, { color: colors.text, fontWeight: item.read ? '600' : '800' }]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                </View>
                <Text style={[styles.notiMessage, { color: colors.textSecondary }]}>{item.message}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.notiTime, { color: colors.textSecondary }]}>{item.time}</Text>
                  <Text style={[styles.metaAction, { color: colors.accent }]}>
                    {item.route ? 'Open' : item.read ? 'Read' : 'New'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={() => removeNotification(item.id)} style={styles.deleteBtn}>
                <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      {notifications.length > 0 && (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={clearAll}
            style={[styles.clearBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.clearBtnText}>Clear All Notifications</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
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
  headerCenter: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 90,
  },
  notiCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  notiMain: {
    flex: 1,
    gap: 4,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  notiTitle: {
    fontSize: 13,
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notiMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  notiTime: {
    fontSize: 10,
  },
  metaAction: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  clearBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  clearBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
