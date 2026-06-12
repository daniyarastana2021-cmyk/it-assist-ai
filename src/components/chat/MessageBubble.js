import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import Avatar from '../common/Avatar';

export default function MessageBubble({ message }) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';

  const cleanText = message.content.replace(/\[CREATE_TICKET:[^\]]+\]/g, '').trim();

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
          <Text style={styles.aiIconText}>AI</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.primary, borderBottomRightRadius: Radius.sm }
            : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: Radius.sm },
          { maxWidth: '80%' },
        ]}
      >
        <Text style={[styles.text, { color: isUser ? '#FFFFFF' : colors.text }]}>
          {cleanText}
        </Text>
      </View>
      {isUser && <Avatar name="Я" size={28} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md, gap: Spacing.sm },
  rowUser: { justifyContent: 'flex-end' },
  aiIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  aiIconText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  bubble: { borderRadius: Radius.lg, padding: Spacing.md },
  text: { ...Typography.body },
});
