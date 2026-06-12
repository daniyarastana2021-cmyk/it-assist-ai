import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import TicketCard from '../../components/tickets/TicketCard';
import EmptyState from '../../components/common/EmptyState';
import { getAllTickets } from '../../services/ticketService';
import { TICKET_STATUSES, TICKET_PRIORITIES } from '../../config/constants';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'critical', label: '🔴 Критические', type: 'priority' },
];

export default function QueueScreen({ navigation }) {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await getAllTickets();
      setTickets(data);
    } catch {}
  }

  useEffect(() => { load(); }, []);
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  const filtered = tickets.filter(t => {
    if (filter === 'all') return t.status !== 'closed';
    if (filter === 'critical') return t.priority === 'critical' && t.status !== 'closed';
    return t.status === filter;
  });

  const newCount = tickets.filter(t => t.status === 'new').length;
  const criticalCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Очередь заявок</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Stats strip */}
      <View style={[styles.stats, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <StatChip label="Новых" value={newCount} color={colors.statusNew} />
        <StatChip label="В работе" value={inProgressCount} color={colors.statusInProgress} />
        <StatChip label="Критических" value={criticalCount} color={colors.priorityCritical} />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, { backgroundColor: filter === f.id ? colors.primary : colors.surface, borderColor: filter === f.id ? colors.primary : colors.border }]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={{ color: filter === f.id ? '#FFF' : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {filtered.length === 0 ? (
          <EmptyState emoji="✅" title="Очередь пуста" subtitle="Все заявки обработаны" />
        ) : (
          filtered.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function StatChip({ label, value, color }) {
  return (
    <View style={[styles.statChip, { borderColor: color + '44' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  title: { ...Typography.title3 },
  countBadge: { borderRadius: Radius.round, paddingHorizontal: Spacing.sm, paddingVertical: 2, minWidth: 28, alignItems: 'center' },
  countText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', padding: Spacing.md, borderBottomWidth: 1 },
  statChip: { alignItems: 'center', borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm, minWidth: 80 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, color: '#888' },
  filters: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, maxHeight: 56 },
  filterChip: { borderRadius: Radius.round, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 6, marginRight: Spacing.sm },
  list: { padding: Spacing.lg },
});
