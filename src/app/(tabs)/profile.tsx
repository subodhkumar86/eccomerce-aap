import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  
  const { orders, showToast } = useStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleToggleNotifications = (val: boolean) => {
    setNotificationsEnabled(val);
    showToast(val ? 'Notifications Enabled' : 'Notifications Muted', 'info');
  };

  const handleToggleBiometrics = (val: boolean) => {
    setBiometricsEnabled(val);
    showToast(val ? 'Biometrics Enabled' : 'Biometrics Disabled', 'info');
  };

  const [profileName, setProfileName] = useState('Sarah Jenkins');
  const [profileEmail, setProfileEmail] = useState('sarah.j@luxe.com');
  const [profileAvatar, setProfileAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [tempName, setTempName] = useState('Sarah Jenkins');
  const [tempEmail, setTempEmail] = useState('sarah.j@luxe.com');
  const [tempAvatar, setTempAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={{ uri: profileAvatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{profileName}</Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>{profileEmail}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/profile/vip' as any)}
              style={[styles.badge, { backgroundColor: colors.accentLight }]}
            >
              <Ionicons name="ribbon-outline" size={12} color={colors.accent} />
              <Text style={[styles.badgeText, { color: colors.accent }]}>Luxe Member</Text>
              <Ionicons name="chevron-forward" size={10} color={colors.accent} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setTempName(profileName);
              setTempEmail(profileEmail);
              setTempAvatar(profileAvatar);
              setIsEditModalVisible(true);
            }}
            style={[styles.editProfileBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Ionicons name="pencil" size={12} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Order History</Text>
            {orders.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/profile/orders' as any)}>
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          {orders.length === 0 ? (
            <View style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.card }}>
              <AnimatedEmptyState
                icon="receipt-outline"
                title="No orders placed yet"
                description="Your completed purchases and receipts will appear here."
              />
            </View>
          ) : (
            <View style={styles.ordersList}>
              {orders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: '/orders/[id]', params: { id: order.id } })}
                  style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  {/* Order Header */}
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                      <Text style={[styles.orderDate, { color: colors.textSecondary }]}>{order.date}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                      <Text style={[styles.statusText, { color: colors.success }]}>{order.status}</Text>
                    </View>
                  </View>

                  <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

                  {/* Order Items Summary */}
                  <View style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.orderItemRow}>
                        <Text style={[styles.orderItemName, { color: colors.text }]} numberOfLines={1}>
                          {item.product.name}
                          {item.selectedSize && ` (${item.selectedSize})`}
                        </Text>
                        <Text style={[styles.orderItemQty, { color: colors.textSecondary }]}>
                          x{item.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

                  {/* Order Footer */}
                  <View style={styles.orderFooter}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Paid Total</Text>
                    <Text style={[styles.totalPrice, { color: colors.accent }]}>₹{order.total}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Notifications */}
            <View style={styles.settingsRow}>
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            {/* Notification Center */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/notifications/index' as any)}
              style={styles.settingsRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Notification Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            {/* Face ID / Biometrics */}
            <View style={styles.settingsRow}>
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="finger-print-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Biometric Login</Text>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            {/* Shipping Addresses */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/profile/addresses' as any)}
              style={styles.settingsRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="location-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Shipping Addresses</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            {/* Payment Methods */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/profile/payments' as any)}
              style={styles.settingsRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="card-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Payment Methods</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            {/* Coupons & Rewards */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/promo' as any)}
              style={styles.settingsRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="pricetag-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Coupons & Rewards</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/promo/scratch' as any)}
              style={styles.settingsRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="gift-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Lucky Scratch Card</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/support' as any)}
              style={styles.supportRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="help-circle-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>FAQ & Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: '/support/chat',
                  params: { id: 'TC-Live', subject: 'Customer Care Chat' },
                } as any)
              }
              style={styles.supportRow}
            >
              <View style={styles.settingsLabelContainer}>
                <Ionicons name="chatbubbles-outline" size={20} color={colors.text} />
                <Text style={[styles.settingsLabel, { color: colors.text }]}>Contact Customer Care</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetContent}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textSecondary}
                style={[styles.inputField, { color: colors.text, borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.text, marginTop: 12 }]}>Email Address</Text>
              <TextInput
                value={tempEmail}
                onChangeText={setTempEmail}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                style={[styles.inputField, { color: colors.text, borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.text, marginTop: 12 }]}>Avatar Image URL</Text>
              <TextInput
                value={tempAvatar}
                onChangeText={setTempAvatar}
                placeholder="Enter image URL"
                placeholderTextColor={colors.textSecondary}
                style={[styles.inputField, { color: colors.text, borderColor: colors.border }]}
              />

              <Text style={[styles.subLabel, { color: colors.textSecondary, marginTop: 12 }]}>Or choose an avatar:</Text>
              <View style={styles.avatarSuggestionsRow}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
                ].map((url, i) => (
                  <TouchableOpacity key={i} onPress={() => setTempAvatar(url)}>
                    <Image
                      source={{ uri: url }}
                      style={[
                        styles.suggestionAvatar,
                        { borderColor: tempAvatar === url ? colors.accent : 'transparent', borderWidth: tempAvatar === url ? 2 : 0 }
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setProfileName(tempName);
                  setProfileEmail(tempEmail);
                  setProfileAvatar(tempAvatar);
                  setIsEditModalVisible(false);
                }}
                style={[styles.saveBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyOrders: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyOrdersText: {
    fontSize: 13,
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  orderHeader: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDivider: {
    height: 1,
  },
  orderItems: {
    gap: 6,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  orderItemQty: {
    fontSize: 13,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  editProfileBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  sheetContent: {
    padding: 20,
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputField: {
    height: 42,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  avatarSuggestionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  suggestionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  saveBtn: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
