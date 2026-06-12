import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import Badge from '../common/Badge';
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES } from '../../config/constants';

export default function TicketCard({ ticket, onPress }) {
  const { colors } = useTheme();

  const status = TICKET_STATUSES.find(s => s.id === ticket.status);
  const priority = TICKET_PRIORITIES.find(p => p.id === ticket.priority);
  const category = TICKET_CATEGORIES.find(c => c.id === ticket.category);

  const date = ticket.createdAt?.toDate
    ? ticket.createdAt.toDate().toLocaleDateString('ru-RU')
    : '—';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {ticket.title}
        </Text>
        <View style={styles.badges}>
          {status && <Badge label={status.label} value={ticket.status} />}
          {priority && <Badge label={priority.label} value={ticket.priority} />}
        </View>
      </View>
      <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
        {ticket.description}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.meta, { color: colors.textDisabled }]}>
          {category?.label || ticket.category}
        </Text>
        <Text style={[styles.meta, { color: colors.textDisabled }]}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: { marginBottom: Spacing.sm },
  title: { ...Typography.bodyStrong, marginBottom: Spacing.xs },
  badges: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  desc: { ...Typography.caption, marginBottom: Spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { ...Typography.small },
});
