import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useStore } from '@/context/StoreContext';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  totalAmount: number;
  onSuccess: () => void;
}

export default function CheckoutModal({ visible, onClose, totalAmount, onSuccess }: CheckoutModalProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const { cart, addOrder, showToast } = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('123 Luxury Ave, Suite 7A, New York');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4890');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const shipping = totalAmount > 200 ? 0 : 15;
  const tax = Math.round(totalAmount * 0.08);
  const finalTotal = totalAmount + shipping + tax;

  const handlePay = () => {
    if (!address.trim()) {
      showToast('Please enter a delivery address', 'error');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber.trim() || !expiry.trim() || !cvv.trim())) {
      showToast('Please fill in complete credit card details', 'error');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      showToast('Please enter your UPI ID', 'error');
      return;
    }

    setLoading(true);
    // Simulate processing payment
    setTimeout(() => {
      setLoading(false);
      addOrder(cart, finalTotal);
      onSuccess(); // Clear cart and close modal
      onClose();
      // Navigate to checkout success
      router.push('/checkout/success');
    }, 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackground}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            {/* Delivery Info */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Delivery Address</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="location-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>

              {/* Quick Select Addresses */}
              <View style={styles.quickAddressRow}>
                {[
                  '123 Luxury Ave, New York',
                  '88 Gold St, San Francisco',
                  '10 Alpine Way, Los Angeles'
                ].map((addr) => (
                  <TouchableOpacity
                    key={addr}
                    activeOpacity={0.7}
                    onPress={() => setAddress(addr)}
                    style={[
                      styles.quickAddressChip,
                      {
                        backgroundColor: address === addr ? colors.accentLight : colors.card,
                        borderColor: address === addr ? colors.accent : colors.border
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickAddressChipText,
                        {
                          color: address === addr ? colors.accent : colors.textSecondary,
                          fontWeight: address === addr ? '700' : '600'
                        }
                      ]}
                    >
                      {addr.split(',')[1].trim()} ({addr.split(',')[0]})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Method Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Payment Method</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paymentSelector}>
                {[
                  { id: 'card', label: 'Credit Card', icon: 'card-outline' },
                  { id: 'upi', label: 'UPI / GPay', icon: 'flash-outline' },
                  { id: 'netbanking', label: 'Net Banking', icon: 'business-outline' },
                  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
                ].map((item) => {
                  const active = paymentMethod === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setPaymentMethod(item.id as any)}
                      style={[
                        styles.payMethodChip,
                        {
                          backgroundColor: active ? colors.accentLight : colors.card,
                          borderColor: active ? colors.accent : colors.border,
                        },
                      ]}
                    >
                      <Ionicons name={item.icon as any} size={15} color={active ? colors.accent : colors.textSecondary} />
                      <Text style={[styles.payMethodChipText, { color: active ? colors.accent : colors.text, fontWeight: active ? '700' : '600' }]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Payment Details Input Wrapper */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Payment Details</Text>

              {paymentMethod === 'card' && (
                <View style={{ gap: 10 }}>
                  <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="card-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                      placeholder="Card Number"
                      placeholderTextColor={colors.textSecondary}
                      style={[styles.input, { color: colors.text }]}
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <TextInput
                        value={expiry}
                        onChangeText={setExpiry}
                        placeholder="MM/YY"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                      />
                    </View>
                    <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <TextInput
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        secureTextEntry
                        placeholder="CVV"
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                      />
                    </View>
                  </View>
                </View>
              )}

              {paymentMethod === 'upi' && (
                <View style={{ gap: 10 }}>
                  <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="flash-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      value={upiId}
                      onChangeText={setUpiId}
                      placeholder="Enter UPI ID (e.g. name@upi)"
                      placeholderTextColor={colors.textSecondary}
                      autoCapitalize="none"
                      style={[styles.input, { color: colors.text }]}
                    />
                  </View>
                  <View style={styles.upiAppsRow}>
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                      <TouchableOpacity
                        key={app}
                        activeOpacity={0.8}
                        onPress={() => setUpiId(`sarah.${app.toLowerCase()}@okhdfcbank`)}
                        style={[styles.upiAppChip, { backgroundColor: colors.card, borderColor: colors.border }]}
                      >
                        <Text style={[styles.upiAppText, { color: colors.text }]}>{app}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {paymentMethod === 'netbanking' && (
                <View style={styles.banksRow}>
                  {['HDFC', 'SBI', 'ICICI', 'AXIS'].map((bank) => {
                    const isSelected = selectedBank === bank;
                    return (
                      <TouchableOpacity
                        key={bank}
                        activeOpacity={0.8}
                        onPress={() => setSelectedBank(bank)}
                        style={[
                          styles.bankChip,
                          {
                            backgroundColor: isSelected ? colors.accentLight : colors.card,
                            borderColor: isSelected ? colors.accent : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.bankText, { color: isSelected ? colors.accent : colors.text }]}>{bank}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {paymentMethod === 'cod' && (
                <View style={[styles.codNotice, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                  <Text style={[styles.codText, { color: colors.textSecondary }]}>
                    Pay in cash or UPI at your doorstep when the shipment arrives. No additional cash collection fees apply!
                  </Text>
                </View>
              )}
            </View>

            {/* Price Summary */}
            <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹{totalAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Estimated Tax (8%)</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>₹{tax}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.accent }]}>₹{finalTotal}</Text>
              </View>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePay}
              disabled={loading}
              style={[styles.payBtn, { backgroundColor: colors.accent }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                  <Text style={styles.payBtnText}>Pay ₹{finalTotal}</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContainer: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  summaryBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickAddressRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  quickAddressChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickAddressChipText: {
    fontSize: 11,
  },
  paymentSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  payMethodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  payMethodChipText: {
    fontSize: 12,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  upiAppChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  upiAppText: {
    fontSize: 12,
    fontWeight: '600',
  },
  banksRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bankChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  bankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  codNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  codText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
