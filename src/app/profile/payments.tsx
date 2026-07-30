import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
  SlideInDown,
  SlideOutLeft,
} from 'react-native-reanimated';
import AnimatedEmptyState from '@/components/AnimatedEmptyState';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

interface CardItem {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  isDefault: boolean;
  color: readonly string[];
}

const BRAND_COLORS = {
  Visa: ['#1E3A8A', '#3B82F6'],
  Mastercard: ['#7C2D12', '#EA580C'],
  Amex: ['#065F46', '#059669'],
} as const;

const maskCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const last4 = digits.slice(-4).padStart(4, '0');
  return `**** **** **** ${last4}`;
};

export default function PaymentsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { showToast } = useStore();

  const [cards, setCards] = useState<CardItem[]>([
    {
      id: 'c1',
      brand: 'Visa',
      cardNumber: '**** **** **** 4242',
      cardHolder: 'Sarah Jenkins',
      expiry: '12/28',
      isDefault: true,
      color: BRAND_COLORS.Visa,
    },
    {
      id: 'c2',
      brand: 'Mastercard',
      cardNumber: '**** **** **** 9804',
      cardHolder: 'Sarah Jenkins',
      expiry: '08/29',
      isDefault: false,
      color: BRAND_COLORS.Mastercard,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrand, setNewBrand] = useState<'Visa' | 'Mastercard' | 'Amex'>('Visa');
  const [newNumber, setNewNumber] = useState('');
  const [newHolder, setNewHolder] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');

  const totalCards = useMemo(() => cards.length, [cards]);

  const handleSetDefault = (id: string) => {
    setCards((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
    showToast('Default payment method updated!', 'success');
  };

  const handleDeleteCard = (id: string, wasDefault: boolean) => {
    setCards((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (wasDefault && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
    showToast('Payment method removed', 'info');
  };

  const handleAddCard = () => {
    const cleanNum = newNumber.replace(/\D/g, '');
    const cleanExpiry = newExpiry.trim();
    const cleanCvv = newCvv.trim();

    if (cleanNum.length < 12 || !newHolder.trim() || cleanExpiry.length < 4 || cleanCvv.length < 3) {
      showToast('Please enter complete payment details.', 'error');
      return;
    }

    const newCard: CardItem = {
      id: Date.now().toString(),
      brand: newBrand,
      cardNumber: maskCardNumber(cleanNum),
      cardHolder: newHolder.trim(),
      expiry: cleanExpiry,
      isDefault: cards.length === 0,
      color: BRAND_COLORS[newBrand],
    };

    setCards((prev) => [...prev, newCard]);
    showToast('New payment card added successfully!', 'success');
    setNewNumber('');
    setNewHolder('');
    setNewExpiry('');
    setNewCvv('');
    setShowAddForm(false);
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
          <Text style={[styles.headerMeta, { color: colors.textSecondary }]}>{totalCards} saved</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowAddForm(true)}
          style={[styles.headerBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Ionicons name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ paddingTop: 90 }}>
            <AnimatedEmptyState
              icon="card-outline"
              title="No payment methods yet"
              description="Save a card here so checkout stays fast and secure."
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowAddForm(true)}
                style={[styles.emptyBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.emptyBtnText}>Add Your First Card</Text>
              </TouchableOpacity>
            </AnimatedEmptyState>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 80).duration(400).springify()}
            exiting={SlideOutLeft.duration(200)}
            layout={LinearTransition.springify().damping(14)}
            style={[
              styles.paymentCard,
              {
                borderColor: item.isDefault ? colors.accent : colors.border,
                backgroundColor: item.color[0],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <Ionicons name="card" size={20} color="#FFFFFF" />
                <Text style={styles.brandText}>{item.brand}</Text>
              </View>
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardNumberText}>{item.cardNumber}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.holderLabel}>CARDHOLDER</Text>
                <Text style={styles.holderName}>{item.cardHolder}</Text>
              </View>
              <View style={styles.cardMeta}>
                <View>
                  <Text style={styles.holderLabel}>EXPIRES</Text>
                  <Text style={styles.holderName}>{item.expiry}</Text>
                </View>
                <View style={styles.cardActions}>
                  {!item.isDefault && (
                    <TouchableOpacity activeOpacity={0.8} onPress={() => handleSetDefault(item.id)} style={styles.cardActionBtn}>
                      <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity activeOpacity={0.8} onPress={() => handleDeleteCard(item.id, item.isDefault)} style={styles.cardActionBtn}>
                    <Ionicons name="trash-outline" size={16} color="#FFB4B4" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      />

      {showAddForm && (
        <View style={styles.backdrop}>
          <Animated.View entering={SlideInDown.duration(300)} style={[styles.formSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Add New Card</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.brandSelection}>
              {(['Visa', 'Mastercard', 'Amex'] as const).map((brand) => {
                const active = newBrand === brand;
                return (
                  <TouchableOpacity
                    key={brand}
                    activeOpacity={0.8}
                    onPress={() => setNewBrand(brand)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? colors.accentLight : colors.card,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: active ? colors.accent : colors.textSecondary }]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.formBody}>
              <TextInput
                value={newNumber}
                onChangeText={setNewNumber}
                placeholder="Card Number"
                maxLength={19}
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              />
              <TextInput
                value={newHolder}
                onChangeText={setNewHolder}
                placeholder="Cardholder Name"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  value={newExpiry}
                  onChangeText={setNewExpiry}
                  placeholder="Expiry (MM/YY)"
                  maxLength={5}
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.border }]}
                />
                <TextInput
                  value={newCvv}
                  onChangeText={setNewCvv}
                  placeholder="CVV"
                  secureTextEntry
                  maxLength={4}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.border }]}
                />
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={handleAddCard} style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
                <Text style={styles.saveBtnText}>Save Payment Card</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
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
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  paymentCard: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  defaultBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cardNumberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  holderLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '600',
  },
  holderName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-end',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  cardActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  formSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  brandSelection: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formBody: {
    gap: 10,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
