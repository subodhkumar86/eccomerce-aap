import React, { useState } from 'react';
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
  SlideOutLeft,
  SlideInDown,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

interface AddressItem {
  id: string;
  label: string; // e.g. "Home", "Work"
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { showToast } = useStore();

  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: 'a1',
      label: 'Home',
      name: 'Sarah Jenkins',
      street: '1049 Whiskey Road, Suite A',
      city: 'Aiken',
      state: 'SC',
      zip: '29803',
      isDefault: true,
    },
    {
      id: 'a2',
      label: 'Work',
      name: 'Sarah Jenkins (Falcon)',
      street: '290 California St, Floor 4',
      city: 'San Francisco',
      state: 'CA',
      zip: '94111',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newName, setNewName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default address updated!', 'success');
  };

  const handleDeleteAddress = (id: string, wasDefault: boolean) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // If we deleted the default, set first remaining as default
      if (wasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    showToast('Address deleted', 'info');
  };

  const handleAddAddress = () => {
    if (!newName.trim() || !newStreet.trim() || !newCity.trim() || !newZip.trim()) {
      showToast('Please fill in all address details.', 'error');
      return;
    }

    const newAddress: AddressItem = {
      id: Date.now().toString(),
      label: newLabel,
      name: newName,
      street: newStreet,
      city: newCity,
      state: newState || 'CA',
      zip: newZip,
      isDefault: addresses.length === 0, // Make default if it's the first address
    };

    setAddresses((prev) => [...prev, newAddress]);
    showToast('New shipping address saved!', 'success');
    
    // Reset Form
    setNewName('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    setShowAddForm(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: colors.border }]} edges={['top']}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shipping Addresses</Text>
        <TouchableOpacity
          onPress={() => setShowAddForm(true)}
          style={[styles.headerAddBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Ionicons name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 80).duration(400).springify()}
            exiting={SlideOutLeft.duration(200)}
            layout={LinearTransition.springify().damping(14)}
            style={[
              styles.addressCard,
              {
                backgroundColor: colors.card,
                borderColor: item.isDefault ? colors.accent : colors.border,
              },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.labelRow}>
                <View style={[styles.tag, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.tagText, { color: colors.accent }]}>{item.label}</Text>
                </View>
                {item.isDefault && (
                  <View style={[styles.tag, { backgroundColor: colors.success + '20' }]}>
                    <Text style={[styles.tagText, { color: colors.success }]}>Default</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.actionRow}>
                {!item.isDefault && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(item.id)}
                    style={styles.actionIconBtn}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(item.id, item.isDefault)}
                  style={styles.actionIconBtn}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Address Details */}
            <View style={styles.cardBody}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.street}</Text>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.city}, {item.state} {item.zip}
              </Text>
            </View>
          </Animated.View>
        )}
      />

      {/* Add Address Drawer Form */}
      {showAddForm && (
        <View style={styles.backdrop}>
          <Animated.View
            entering={SlideInDown.duration(300)}
            style={[styles.formSheet, { backgroundColor: colors.background }]}
          >
            <View style={[styles.formHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Label Chip selectors */}
            <View style={styles.labelChips}>
              {['Home', 'Work', 'Other'].map((label) => {
                const active = newLabel === label;
                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => setNewLabel(label)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? colors.accentLight : colors.card,
                        borderColor: active ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: active ? colors.accent : colors.textSecondary }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Form Inputs */}
            <View style={styles.formBody}>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              />
              <TextInput
                value={newStreet}
                onChangeText={setNewStreet}
                placeholder="Street address"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  value={newCity}
                  onChangeText={setNewCity}
                  placeholder="City"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { flex: 2, color: colors.text, borderColor: colors.border }]}
                />
                <TextInput
                  value={newState}
                  onChangeText={setNewState}
                  placeholder="State"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { flex: 1, color: colors.text, borderColor: colors.border }]}
                />
                <TextInput
                  value={newZip}
                  onChangeText={setNewZip}
                  placeholder="Zip"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { flex: 1.2, color: colors.text, borderColor: colors.border }]}
                />
              </View>

              <TouchableOpacity
                onPress={handleAddAddress}
                style={[styles.saveBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.saveBtnText}>Save Delivery Address</Text>
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
  headerAddBtn: {
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
  listContent: {
    padding: 20,
    gap: 12,
  },
  addressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 4,
  },
  cardBody: {
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailText: {
    fontSize: 12,
    lineHeight: 16,
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
  labelChips: {
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
});
