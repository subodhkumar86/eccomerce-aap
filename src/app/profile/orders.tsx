import React, { useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';

type FilterTabType = 'All' | 'Processing' | 'Shipped' | 'Delivered';

export default function OrderHistoryScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();

  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<FilterTabType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: FilterTabType[] = ['All', 'Processing', 'Shipped', 'Delivered'];

  // Filter orders by tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      
      const cleanQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(cleanQuery) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(cleanQuery)
        );

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const getStatusColor = (status: 'Processing' | 'Shipped' | 'Delivered') => {
    if (status === 'Processing') return colors.accent;
    if (status === 'Shipped') return '#3B82F6'; // Blue for transit
    return colors.success;
  };

  const getStatusBg = (status: 'Processing' | 'Shipped' | 'Delivered') => {
    if (status === 'Processing') return colors.accentLight;
    if (status === 'Shipped') return '#3B82F615';
    return colors.success + '15';
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* Search and Tabs Bar */}
      <View style={[styles.searchTabsContainer, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by Order ID or product name..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            const count = tab === 'All' 
              ? orders.length 
              : orders.filter((o) => o.status === tab).length;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: active ? colors.accentLight : colors.card,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    {
                      color: active ? colors.accent : colors.textSecondary,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                >
                  {tab} <Text style={{ fontSize: 10, opacity: active ? 0.9 : 0.6 }}>({count})</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingTop: 60 }}>
            <AnimatedEmptyState
              icon="receipt-outline"
              title="No orders found"
              description="We couldn't find any orders matching your criteria. Try shopping or changing filters."
            >
              {activeTab !== 'All' || searchQuery !== '' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveTab('All');
                    setSearchQuery('');
                  }}
                  style={[styles.resetBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Reset Filters</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/')}
                  style={[styles.resetBtn, { backgroundColor: colors.accent }]}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Shop Now</Text>
                </TouchableOpacity>
              )}
            </AnimatedEmptyState>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50).duration(400).springify()}
            style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.orderId, { color: colors.text }]}>{item.id}</Text>
                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Card Items */}
            <View style={styles.itemsList}>
              {item.items.map((cartItem, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Image source={{ uri: cartItem.product.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                      {cartItem.product.name}
                    </Text>
                    <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
                      Qty: {cartItem.quantity} • Color:{' '}
                      <Text style={{ fontWeight: '600' }}>{cartItem.selectedColor}</Text>
                      {cartItem.selectedSize && ` • Size: ${cartItem.selectedSize}`}
                    </Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>
                    ₹{cartItem.product.price * cartItem.quantity}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Paid Total</Text>
                <Text style={[styles.totalPrice, { color: colors.accent }]}>₹{item.total}</Text>
              </View>

              <View style={styles.footerActions}>
                {item.status === 'Shipped' && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push({ pathname: '/orders/track', params: { id: item.id } })}
                    style={[styles.actionBtn, { backgroundColor: colors.accent }]}
                  >
                    <Ionicons name="navigate-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>Track</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: '/orders/[id]', params: { id: item.id } })}
                  style={[styles.actionBtnSec, { borderColor: colors.border, borderWidth: 1 }]}
                >
                  <Text style={[styles.actionBtnSecText, { color: colors.text }]}>Invoice</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      />
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
  searchTabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
    padding: 0,
  },
  tabsRow: {
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabChipText: {
    fontSize: 12,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  orderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 11,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnSec: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSecText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
