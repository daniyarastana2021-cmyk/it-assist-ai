import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import TicketCard from '../../components/tickets/TicketCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getMyTickets } from '../../services/ticketService';
import { TICKET_STATUSES } from '../../config/constants';

const FILTERS = [{ id: 'all', label: 'Все' }, ...TICKET_STATUSES];

export default function MyTicketsScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      if (profile?.uid) {
        const data = await getMyTickets(profile.uid);
        setTickets(data);
      }
    } catch {}
  }

  useEffect(() => { load(); }, [profile]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Мои заявки</Text>
        <TouchableOpacity
          style={[styles.newBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('NewTicket')}
        >
          <Text style={styles.newBtnText}>+ Новая</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.id ? colors.primary : colors.surface,
                borderColor: filter === f.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={{ color: filter === f.id ? '#FFF' : colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {filtered.length === 0 ? (
          <EmptyState
            emoji="🎫"
            title="Заявок нет"
            subtitle="Создайте заявку или используйте AI-помощник для быстрого решения"
            action={
              <Button title="Создать заявку" onPress={() => navigation.navigate('NewTicket')} />
            }
          />
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  title: { ...Typography.title3 },
  newBtn: { borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  newBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  filters: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, maxHeight: 56 },
  filterChip: {
    borderRadius: Radius.round, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  list: { padding: Spacing.lg, paddingTop: Spacing.sm },
});
