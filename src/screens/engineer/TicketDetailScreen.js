import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import Badge from '../../components/common/Badge';
import LoadingScreen from '../../components/common/LoadingScreen';
import { getTicketById, updateTicketStatus, addComment } from '../../services/ticketService';
import { TICKET_STATUSES, TICKET_PRIORITIES, TICKET_CATEGORIES } from '../../config/constants';

const NEXT_STATUSES = {
  new: ['assigned', 'in_progress'],
  assigned: ['in_progress', 'resolved'],
  in_progress: ['resolved', 'closed'],
  resolved: ['closed', 'in_progress'],
  closed: [],
};

export default function TicketDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const isEngineer = profile?.role === 'engineer' || profile?.role === 'admin';

  async function load() {
    const data = await getTicketById(ticketId);
    setTicket(data);
  }

  useEffect(() => { load(); }, [ticketId]);

  async function handleStatusChange(newStatus) {
    setLoading(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
      await load();
    } catch { Alert.alert('Ошибка', 'Не удалось обновить статус'); }
    finally { setLoading(false); }
  }

  async function handleComment() {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addComment(ticketId, profile?.uid, profile?.displayName, comment.trim());
      setComment('');
      await load();
    } catch { Alert.alert('Ошибка', 'Не удалось добавить комментарий'); }
    finally { setLoading(false); }
  }

  if (!ticket) return <LoadingScreen />;

  const status = TICKET_STATUSES.find(s => s.id === ticket.status);
  const priority = TICKET_PRIORITIES.find(p => p.id === ticket.priority);
  const category = TICKET_CATEGORIES.find(c => c.id === ticket.category);
  const nextStatuses = isEngineer ? (NEXT_STATUSES[ticket.status] || []) : [];

  const date = ticket.createdAt?.toDate
    ? ticket.createdAt.toDate().toLocaleString('ru-RU')
    : '—';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, ...Typography.body }}>← Назад</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Заявка</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title & badges */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{ticket.title}</Text>
          <View style={styles.badges}>
            {status && <Badge label={status.label} value={ticket.status} />}
            {priority && <Badge label={priority.label} value={ticket.priority} />}
          </View>
        </View>

        {/* Meta */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Row label="Категория" value={category?.label || ticket.category} colors={colors} />
          <Row label="Создал" value={ticket.createdByName || ticket.createdBy} colors={colors} />
          <Row label="Дата создания" value={date} colors={colors} />
          {ticket.assignedTo && <Row label="Исполнитель" value={ticket.assignedTo} colors={colors} />}
        </View>

        {/* Description */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Описание</Text>
          <Text style={[Typography.body, { color: colors.textSecondary }]}>{ticket.description}</Text>
        </View>

        {/* AI Solution */}
        {ticket.aiSolution && (
          <View style={[styles.card, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '44' }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🤖 AI решение</Text>
            <Text style={[Typography.body, { color: colors.text }]} numberOfLines={6}>
              {ticket.aiSolution.replace(/\[CREATE_TICKET:[^\]]+\]/g, '').trim()}
            </Text>
          </View>
        )}

        {/* Status actions */}
        {nextStatuses.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Изменить статус</Text>
            <View style={styles.statusButtons}>
              {nextStatuses.map(s => {
                const st = TICKET_STATUSES.find(x => x.id === s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusBtn, { backgroundColor: colors[`status${s.charAt(0).toUpperCase() + s.slice(1).replace('_', '')}`] + '22', borderColor: colors[`status${s.charAt(0).toUpperCase() + s.slice(1).replace('_', '')}`] }]}
                    onPress={() => handleStatusChange(s)}
                    disabled={loading}
                  >
                    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }}>{st?.label || s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Comments */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Комментарии ({ticket.comments?.length || 0})
          </Text>
          {ticket.comments?.map((c, i) => (
            <View key={i} style={[styles.comment, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[Typography.captionStrong, { color: colors.primary }]}>{c.displayName}</Text>
              <Text style={[Typography.body, { color: colors.text }]}>{c.text}</Text>
              <Text style={[Typography.small, { color: colors.textDisabled }]}>
                {new Date(c.createdAt).toLocaleString('ru-RU')}
              </Text>
            </View>
          ))}

          <View style={styles.commentInput}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Добавить комментарий..."
              placeholderTextColor={colors.textDisabled}
              style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
              multiline
            />
            <TouchableOpacity
              onPress={handleComment}
              disabled={!comment.trim() || loading}
              style={[styles.sendBtn, { backgroundColor: comment.trim() ? colors.primary : colors.border }]}
            >
              <Text style={{ color: '#FFF', fontWeight: '600' }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, colors }) {
  return (
    <View style={styles.row}>
      <Text style={[Typography.caption, { color: colors.textSecondary, width: 110 }]}>{label}</Text>
      <Text style={[Typography.bodyStrong, { color: colors.text, flex: 1 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  headerTitle: { ...Typography.headline },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  title: { ...Typography.title3, marginBottom: Spacing.md },
  badges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  row: { flexDirection: 'row', paddingVertical: Spacing.xs },
  sectionTitle: { ...Typography.bodyStrong, marginBottom: Spacing.md },
  statusButtons: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  statusBtn: { borderRadius: Radius.md, borderWidth: 1.5, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  comment: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm, gap: 4 },
  commentInput: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, alignItems: 'flex-end' },
  input: { flex: 1, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md, ...Typography.body, maxHeight: 80 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
