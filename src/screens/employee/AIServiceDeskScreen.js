import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import MessageBubble from '../../components/chat/MessageBubble';
import TypingIndicator from '../../components/chat/TypingIndicator';
import { sendMessage, parseTicketFromAIResponse } from '../../services/aiService';
import { createTicket } from '../../services/ticketService';
import { TICKET_CATEGORIES } from '../../config/constants';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Здравствуйте! Я AI-ассистент IT службы поддержки. Опишите вашу проблему, и я помогу её решить. 🤖',
};

export default function AIServiceDeskScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  async function handleSend() {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setTyping(true);
    scrollToBottom();

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const result = await sendMessage(apiMessages);

      const aiMsg = { role: 'assistant', content: result.content };
      setMessages(prev => [...prev, aiMsg]);

      // Check if AI wants to create a ticket
      const ticket = parseTicketFromAIResponse(result.content);
      if (ticket) {
        setTimeout(() => {
          Alert.alert(
            '🎫 Создать заявку?',
            `AI предлагает создать заявку:\n\nКатегория: ${TICKET_CATEGORIES.find(c => c.id === ticket.category)?.label || ticket.category}\nОписание: ${ticket.description}`,
            [
              { text: 'Отмена', style: 'cancel' },
              {
                text: 'Создать заявку',
                onPress: async () => {
                  try {
                    await createTicket({
                      title: ticket.description,
                      description: text,
                      category: ticket.category,
                      priority: ticket.priority,
                      createdBy: profile?.uid,
                      createdByName: profile?.displayName,
                      aiSolution: result.content,
                    });
                    Alert.alert('✅ Заявка создана', 'Специалист свяжется с вами в ближайшее время.');
                    navigation.navigate('TicketsTab');
                  } catch {
                    Alert.alert('Ошибка', 'Не удалось создать заявку. Попробуйте вручную.');
                  }
                },
              },
            ]
          );
        }, 500);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Произошла ошибка. Попробуйте снова или создайте заявку вручную.' },
      ]);
    } finally {
      setTyping(false);
      scrollToBottom();
    }
  }

  function handleReset() {
    setMessages([INITIAL_MESSAGE]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.aiAvatarText}>AI</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Service Desk</Text>
            <View style={styles.onlineRow}>
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.onlineText, { color: colors.success }]}>Онлайн</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleReset} style={[styles.resetBtn, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Сбросить</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {typing && <TypingIndicator />}
        </ScrollView>

        {/* Quick suggestions */}
        {messages.length === 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
            {['Не работает Outlook', 'Проблема с VPN', 'Нет доступа', 'Не включается ноутбук'].map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.suggestion, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '44' }]}
                onPress={() => setInput(s)}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Опишите проблему..."
            placeholderTextColor={colors.textDisabled}
            style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || typing}
            style={[styles.sendBtn, { backgroundColor: input.trim() && !typing ? colors.primary : colors.border }]}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  aiAvatarText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  headerTitle: { ...Typography.bodyStrong },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  onlineText: { fontSize: 11 },
  resetBtn: { borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  messages: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  suggestions: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, maxHeight: 48 },
  suggestion: {
    borderRadius: Radius.round, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    padding: Spacing.md, borderTopWidth: 1,
  },
  input: {
    flex: 1, borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.md, maxHeight: 100, ...Typography.body,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: -2 },
});
