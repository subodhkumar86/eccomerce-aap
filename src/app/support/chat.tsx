import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useStore } from '@/context/StoreContext';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const delay = 180;
    dot1.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      true
    );

    const t2 = setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    }, delay);

    const t3 = setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      );
    }, delay * 2);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const style3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, style1]} />
      <Animated.View style={[styles.typingDot, style2]} />
      <Animated.View style={[styles.typingDot, style3]} />
    </View>
  );
};

export default function SupportChatScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || !scheme ? 'light' : scheme];
  const router = useRouter();
  const { id, subject } = useLocalSearchParams<{ id: string; subject: string }>();
  const { showToast } = useStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'support',
      text: `Hello! Thank you for reaching LuxeCart Support. I see this is regarding your ticket: "${subject || 'General Inquiry'}" (ID: ${id || 'TC-2039'}). How can I assist you further today?`,
      time: '12:30 PM',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const msgIdCounter = useRef(0);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    msgIdCounter.current += 1;
    const userMsg: Message = {
      id: `u-${msgIdCounter.current}`,
      sender: 'user',
      text: inputMessage.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Trigger mock typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      msgIdCounter.current += 1;
      const botMsg: Message = {
        id: `s-${msgIdCounter.current}`,
        sender: 'support',
        text: getBotResponse(userMsg.text),
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 2000);
  };

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('where')) {
      return "I have checked the courier registry for you. The package is currently in transit to your regional sorting hub and is scheduled for home delivery by tomorrow afternoon. We'll update your tracking status as soon as it departs.";
    }
    if (lower.includes('refund') || lower.includes('cancel') || lower.includes('money')) {
      return "Our account specialists have approved the cancellation ledger. The refund is being processed to your original payment card and should settle in your account within 2-3 business days depending on your bank.";
    }
    if (lower.includes('warranty') || lower.includes('broken') || lower.includes('defect')) {
      return "Oh, I'm sorry to hear that! Please rest assured that LuxeCart items carry a 2-year full coverage warranty. I will forward a complimentary return label to your profile dashboard so we can dispatch a brand-new unit.";
    }
    return "Thank you for the detailed information. I have added these notes to your ticket dossier. Our VIP engineering desk is reviewing the logs and will follow up shortly. Let me know if there's anything else I can clarify!";
  };

  // Scroll to bottom when messages or typing state updates
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isTyping]);

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
        
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{id || 'TC-2039'}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>Support Advisor Active</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => showToast('Connecting to a telephone specialist...', 'success')}
          style={[styles.headerBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Ionicons name="call" size={18} color={colors.accent} />
        </TouchableOpacity>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isUser = item.sender === 'user';
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50).duration(300).springify().damping(12)}
                style={[
                  styles.messageBubbleContainer,
                  isUser ? styles.userBubbleContainer : styles.supportBubbleContainer,
                ]}
              >
                {!isUser && (
                  <View style={[styles.avatar, { backgroundColor: colors.accentLight }]}>
                    <Ionicons name="headset-outline" size={14} color={colors.accent} />
                  </View>
                )}

                <View style={styles.bubbleTextWrapper}>
                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? [styles.userBubble, { backgroundColor: colors.accent }]
                        : [styles.supportBubble, { backgroundColor: colors.card, borderColor: colors.border }],
                    ]}
                  >
                    <Text style={[styles.messageText, { color: isUser ? '#FFFFFF' : colors.text }]}>
                      {item.text}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timeText,
                      isUser ? styles.userTimeText : styles.supportTimeText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </Animated.View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <Animated.View entering={FadeInUp} style={styles.typingWrapper}>
                <View style={[styles.avatar, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="headset-outline" size={14} color={colors.accent} />
                </View>
                <TypingIndicator />
              </Animated.View>
            ) : null
          }
        />

        {/* Input Bar */}
        <SafeAreaView style={[styles.inputBar, { borderTopColor: colors.border }]} edges={['bottom']}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            style={[styles.textInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputMessage.trim() ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  headerInfo: {
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 30,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    maxWidth: '85%',
    gap: 10,
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  supportBubbleContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  bubbleTextWrapper: {
    gap: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '100%',
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  supportBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 9,
    marginTop: 2,
  },
  userTimeText: {
    textAlign: 'right',
  },
  supportTimeText: {
    textAlign: 'left',
  },
  typingWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginLeft: 2,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#F1F5F91A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    height: 36,
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
