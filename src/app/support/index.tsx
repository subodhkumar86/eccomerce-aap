import React, { useState } from 'react';
import {
  ScrollView,
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
  FadeInUp,
  FadeOutDown,
} from 'react-native-reanimated';
import { formatCurrency } from '@/constants/currency';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

interface AccordionItemProps {
  question: string;
  answer: string;
  colors: typeof Colors.light | typeof Colors.dark;
}

const FAQAccordionItem = ({ question, answer, colors }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded((prev) => !prev)} style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {expanded && (
        <Animated.View entering={FadeInUp.duration(200)} exiting={FadeOutDown.duration(150)} style={styles.faqAnswerContainer}>
          <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{answer}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default function SupportScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { showToast } = useStore();

  const [ticketCategory, setTicketCategory] = useState('Orders');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 'TC-2039', category: 'Orders', subject: 'Keyboard switch replacement query', date: 'Today, 2:30 PM', status: 'Open' },
    { id: 'TC-1982', category: 'Return', subject: 'Keycaps refund request', date: 'July 25, 2026', status: 'Resolved' },
  ]);

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please fill in all support ticket fields.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Support ticket submitted successfully!', 'success');
      const newTicket = {
        id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
        category: ticketCategory,
        subject: ticketSubject.trim(),
        date: 'Just now',
        status: 'Open',
      };
      setTickets((prev) => [newTicket, ...prev]);
      setTicketSubject('');
      setTicketMessage('');
    }, 1200);
  };

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused products in their original packaging. Returns are fully insured and complimentary.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3 to 5 business days. Express shipping takes 1 to 2 business days. Shipping is free above ' + formatCurrency(200) + '.',
    },
    {
      question: 'Are my payments secure?',
      answer: 'Yes. All payments are encrypted using bank-grade AES-256 protocols and processed through authenticated merchant vaults.',
    },
    {
      question: 'Do these items include warranty?',
      answer: 'All LuxeCart products include a 2-year manufacturer warranty covering operational defects.',
    },
    {
      question: 'Can I cancel my order after placing it?',
      answer: 'Orders can be cancelled shortly after placement while they are still in the processing state.',
    },
    {
      question: 'How do I redeem my VIP loyalty coupons?',
      answer: 'Copy an unlocked VIP code from the rewards page and paste it into the promo box during checkout.',
    },
  ];

  const quickActions = [
    {
      icon: 'mail-outline',
      label: 'Email',
      value: 'support@luxecart.com',
      onPress: () => showToast('Email composer would open in a production build.', 'info'),
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: 'Live Chat',
      value: '24/7 Advisor',
      onPress: () => showToast('Connecting you to a live advisor...', 'success'),
    },
    {
      icon: 'call-outline',
      label: 'Helpline',
      value: '+1 (800) 555-LUXE',
      onPress: () => showToast('Helpline dialer would open in a production build.', 'info'),
    },
  ];

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Direct Contact</Text>
        <View style={styles.contactRow}>
          {quickActions.map((item, index) => (
            <Animated.View
              key={item.label}
              entering={FadeInDown.delay(index * 80).duration(400).springify()}
              style={{ flex: 1 }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={item.onPress}
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Ionicons name={item.icon as any} size={22} color={colors.accent} />
                <Text style={[styles.contactLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>{item.value}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <Animated.View key={faq.question} entering={FadeInDown.delay(index * 100).duration(400).springify()}>
              <FAQAccordionItem question={faq.question} answer={faq.answer} colors={colors} />
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(500).springify()}
          style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.ticketTitle, { color: colors.text }]}>Submit a Support Ticket</Text>
          <Text style={[styles.ticketSubtitle, { color: colors.textSecondary }]}>
            Describe the issue and we&apos;ll respond with priority handling.
          </Text>

          <View style={styles.categoryRow}>
            {['Orders', 'Payments', 'Return', 'Other'].map((category) => {
              const active = ticketCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.7}
                  onPress={() => setTicketCategory(category)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: active ? colors.accentLight : colors.background,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      {
                        color: active ? colors.accent : colors.textSecondary,
                        fontWeight: active ? '700' : '500',
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            value={ticketSubject}
            onChangeText={setTicketSubject}
            placeholder="Subject summary"
            placeholderTextColor={colors.textSecondary}
            style={[styles.ticketInput, { color: colors.text, borderColor: colors.border }]}
          />

          <TextInput
            value={ticketMessage}
            onChangeText={setTicketMessage}
            placeholder="Describe your issue in detail..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            style={[styles.ticketInput, styles.ticketTextarea, { color: colors.text, borderColor: colors.border }]}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmitTicket}
            style={[styles.submitBtn, { backgroundColor: colors.accent }]}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Support Ticket'}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500).springify()} style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Active Tickets</Text>
          <View style={styles.ticketsList}>
            {tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/support/chat',
                    params: { id: ticket.id, subject: ticket.subject },
                  } as any)
                }
                style={[styles.ticketRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.ticketRowHeader}>
                  <View style={styles.ticketMeta}>
                    <Text style={[styles.ticketId, { color: colors.accent }]}>{ticket.id}</Text>
                    <View style={[styles.ticketTag, { backgroundColor: colors.background }]}>
                      <Text style={[styles.ticketTagText, { color: colors.textSecondary }]}>{ticket.category}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.ticketStatus,
                      {
                        backgroundColor: ticket.status === 'Resolved' ? colors.success + '20' : colors.accentLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketStatusText,
                        {
                          color: ticket.status === 'Resolved' ? colors.success : colors.accent,
                        },
                      ]}
                    >
                      {ticket.status}
                    </Text>
                  </View>
                </View>
                <Text numberOfLines={1} style={[styles.ticketSubjectText, { color: colors.text }]}>{ticket.subject}</Text>
                <Text style={[styles.ticketDateText, { color: colors.textSecondary }]}>{ticket.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  contactValue: {
    fontSize: 10,
    textAlign: 'center',
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  faqAnswer: {
    fontSize: 12,
    lineHeight: 18,
  },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 10,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  ticketSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 11,
  },
  ticketInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  ticketTextarea: {
    height: 90,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  submitBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  recentSection: {
    marginTop: 10,
    width: '100%',
  },
  ticketsList: {
    gap: 12,
    marginTop: 8,
  },
  ticketRow: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  ticketRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '700',
  },
  ticketTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketTagText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ticketStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ticketStatusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ticketSubjectText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ticketDateText: {
    fontSize: 10,
  },
});
