import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import { getAllTickets } from '../../services/ticketService';
import { TICKET_CATEGORIES } from '../../config/constants';

function KpiCard({ label, value, sub, color, colors }) {
  return (
    <View style={[styles.kpiCard, { backgroundColor: color + '18', borderColor: color + '44' }]}>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={[styles.kpiLabel, { color: colors.text }]}>{label}</Text>
      {sub && <Text style={[styles.kpiSub, { color: colors.textSecondary }]}>{sub}</Text>}
    </View>
  );
}

function BarRow({ label, value, max, color, colors }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try { setTickets(await getAllTickets()); } catch {}
  }

  useEffect(() => { load(); }, []);
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  const total = tickets.length;
  const open = tickets.filter(t => !['resolved', 'closed'].includes(t.status)).length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const byCategory = TICKET_CATEGORIES.map(c => ({
    label: c.label,
    value: tickets.filter(t => t.category === c.id).length,
  })).filter(x => x.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);

  const maxCat = Math.max(...byCategory.map(x => x.value), 1);

  const byStatus = [
    { label: 'Новых', value: tickets.filter(t => t.status === 'new').length, color: colors.statusNew },
    { label: 'Назначено', value: tickets.filter(t => t.status === 'assigned').length, color: colors.statusAssigned },
    { label: 'В работе', value: tickets.filter(t => t.status === 'in_progress').length, color: colors.statusInProgress },
    { label: 'Решено', value: resolved, color: colors.statusResolved },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>📊 Аналитика</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Обзор работы Service Desk
        </Text>
      </View>

      <View style={styles.content}>
        {/* KPI Row */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ключевые показатели</Text>
        <View style={styles.kpiGrid}>
          <KpiCard label="Всего заявок" value={total} color={colors.primary} colors={colors} />
          <KpiCard label="Открытых" value={open} color={colors.warning} colors={colors} />
          <KpiCard label="Решено" value={resolved} color={colors.success} colors={colors} />
          <KpiCard label="Критических" value={critical} color={colors.error} colors={colors} />
        </View>

        {/* Resolution rate */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Уровень решаемости</Text>
          <View style={styles.rateRow}>
            <View style={[styles.rateCircle, { borderColor: colors.success }]}>
              <Text style={[styles.rateValue, { color: colors.success }]}>{resolutionRate}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              {byStatus.map(s => (
                <BarRow key={s.label} label={s.label} value={s.value} max={total} color={s.color} colors={colors} />
              ))}
            </View>
          </View>
        </View>

        {/* By category */}
        {byCategory.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>По категориям</Text>
            {byCategory.map(c => (
              <BarRow key={c.label} label={c.label} value={c.value} max={maxCat} color={colors.primary} colors={colors} />
            ))}
          </View>
        )}

        {/* Recent activity note */}
        <View style={[styles.card, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '44' }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>💡 AI Insights</Text>
          <Text style={[Typography.body, { color: colors.text }]}>
            {critical > 0
              ? `⚠️ ${critical} критических заявок требуют немедленного внимания.`
              : '✅ Критических заявок нет.'}
            {'\n'}
            {open > 0
              ? `📋 ${open} активных заявок в очереди.`
              : '🎉 Все заявки обработаны!'}
            {'\n'}
            {`📈 Уровень решаемости: ${resolutionRate}%`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1 },
  title: { ...Typography.title3, marginBottom: 2 },
  subtitle: { ...Typography.caption },
  content: { padding: Spacing.lg },
  sectionTitle: { ...Typography.headline, marginBottom: Spacing.md },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  kpiCard: {
    width: '47%', borderRadius: Radius.lg, borderWidth: 1,
    padding: Spacing.lg, alignItems: 'center',
  },
  kpiValue: { fontSize: 28, fontWeight: '800' },
  kpiLabel: { ...Typography.captionStrong, textAlign: 'center', marginTop: 4 },
  kpiSub: { ...Typography.small, textAlign: 'center' },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  rateCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  rateValue: { fontSize: 20, fontWeight: '800' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  barLabel: { width: 80, ...Typography.small },
  barTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barValue: { width: 28, textAlign: 'right', ...Typography.captionStrong },
});
