import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { getMyTickets } from '../../services/ticketService';
import { TICKET_STATUSES } from '../../config/constants';

function StatCard({ label, value, color, colors }) {
  return (
    <View style={[styles.statCard, { backgroundColor: color + '18', borderColor: color + '44' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [tickets, setTickets] = useState([]);
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

  const byStatus = id => tickets.filter(t => t.status === id).length;
  const recent = tickets.slice(0, 3);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Добро пожаловать 👋</Text>
            <Text style={styles.name}>{profile?.displayName || 'Сотрудник'}</Text>
          </View>
          <Avatar name={profile?.displayName || 'U'} size={44} />
        </View>
        <Text style={styles.tagline}>IT Assist AI · Service Desk</Text>
      </View>

      <View style={styles.content}>
        {/* Quick actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Быстрые действия</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AITab')}
          >
            <Text style={styles.quickIcon}>🤖</Text>
            <Text style={styles.quickLabel}>AI Помощник</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate('TicketsTab', { screen: 'NewTicket' })}
          >
            <Text style={styles.quickIcon}>➕</Text>
            <Text style={styles.quickLabel}>Новая заявка</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: '#107C10' }]}
            onPress={() => navigation.navigate('KBTab')}
          >
            <Text style={styles.quickIcon}>📚</Text>
            <Text style={styles.quickLabel}>База знаний</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Мои заявки</Text>
        <View style={styles.statsRow}>
          <StatCard label="Всего" value={tickets.length} color={colors.primary} colors={colors} />
          <StatCard label="В работе" value={byStatus('in_progress')} color={colors.warning} colors={colors} />
          <StatCard label="Решено" value={byStatus('resolved') + byStatus('closed')} color={colors.success} colors={colors} />
        </View>

        {/* Recent tickets */}
        {recent.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Последние заявки</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TicketsTab')}>
                <Text style={{ color: colors.primary, ...Typography.captionStrong }}>Все →</Text>
              </TouchableOpacity>
            </View>
            {recent.map(ticket => {
              const st = TICKET_STATUSES.find(s => s.id === ticket.status);
              return (
                <TouchableOpacity
                  key={ticket.id}
                  style={[styles.recentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => navigation.navigate('TicketsTab', { screen: 'TicketDetail', params: { ticketId: ticket.id } })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recentTitle, { color: colors.text }]} numberOfLines={1}>{ticket.title}</Text>
                    <Text style={[Typography.small, { color: colors.textSecondary }]}>{ticket.category}</Text>
                  </View>
                  {st && <Badge label={st.label} value={ticket.status} />}
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Promo AI */}
        <Card style={[styles.aiPromo, { borderColor: colors.primary + '44' }]}>
          <Text style={[styles.aiPromoTitle, { color: colors.text }]}>🤖 AI Помощник</Text>
          <Text style={[styles.aiPromoText, { color: colors.textSecondary }]}>
            Опишите проблему — AI предложит решение или автоматически создаст заявку
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AITab')}>
            <Text style={{ color: colors.primary, fontWeight: '600', marginTop: Spacing.sm }}>
              Открыть AI чат →
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: Spacing.xl, paddingTop: 56, paddingBottom: Spacing.xxl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  name: { color: '#FFFFFF', ...Typography.title3 },
  tagline: { color: 'rgba(255,255,255,0.6)', ...Typography.caption },
  content: { padding: Spacing.xl },
  sectionTitle: { ...Typography.headline, marginBottom: Spacing.md, marginTop: Spacing.xs },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  quickActions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  quickBtn: {
    flex: 1, borderRadius: Radius.lg, padding: Spacing.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  quickIcon: { fontSize: 24, marginBottom: Spacing.xs },
  quickLabel: { color: '#FFF', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: {
    flex: 1, borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
  },
  statValue: { ...Typography.title2 },
  statLabel: { ...Typography.small, textAlign: 'center' },
  recentItem: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.md, marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  recentTitle: { ...Typography.bodyStrong },
  aiPromo: { marginTop: Spacing.md },
  aiPromoTitle: { ...Typography.headline, marginBottom: Spacing.xs },
  aiPromoText: { ...Typography.body },
});
