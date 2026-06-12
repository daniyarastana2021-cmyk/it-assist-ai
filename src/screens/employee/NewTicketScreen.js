import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { createTicket } from '../../services/ticketService';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../config/constants';

export default function NewTicketScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { profile } = useAuth();

  const prefill = route.params?.prefill || {};
  const [title, setTitle] = useState(prefill.title || '');
  const [description, setDescription] = useState(prefill.description || '');
  const [category, setCategory] = useState(prefill.category || '');
  const [priority, setPriority] = useState(prefill.priority || 'medium');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title || !description || !category) {
      Alert.alert('Заполните все поля');
      return;
    }
    setLoading(true);
    try {
      await createTicket({
        title,
        description,
        category,
        priority,
        createdBy: profile?.uid,
        createdByName: profile?.displayName,
        createdByEmail: profile?.email,
      });
      Alert.alert('✅ Заявка создана', 'Специалист свяжется с вами в ближайшее время.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Ошибка', 'Не удалось создать заявку. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary, ...Typography.body }}>← Назад</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Новая заявка</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Input label="Тема заявки *" value={title} onChangeText={setTitle} placeholder="Кратко опишите проблему" autoCapitalize="sentences" />
          <Input label="Описание *" value={description} onChangeText={setDescription} placeholder="Подробно опишите проблему..." multiline numberOfLines={4} autoCapitalize="sentences" />

          {/* Category */}
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Категория *</Text>
          <View style={styles.grid}>
            {TICKET_CATEGORIES.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: category === c.id ? colors.primary : colors.surface,
                    borderColor: category === c.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setCategory(c.id)}
              >
                <Text style={{ color: category === c.id ? '#FFF' : colors.text, fontSize: 12, fontWeight: '500', textAlign: 'center' }}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority */}
          <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: Spacing.lg }]}>Приоритет</Text>
          <View style={styles.priorityRow}>
            {TICKET_PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor: priority === p.id ? colors[`priority${p.id.charAt(0).toUpperCase() + p.id.slice(1)}`] : colors.surface,
                    borderColor: colors[`priority${p.id.charAt(0).toUpperCase() + p.id.slice(1)}`],
                  },
                ]}
                onPress={() => setPriority(p.id)}
              >
                <Text style={{ color: priority === p.id ? '#FFF' : colors.text, fontSize: 12, fontWeight: '600' }}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Создать заявку" onPress={handleCreate} loading={loading} style={{ marginTop: Spacing.xl }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  title: { ...Typography.headline },
  form: { padding: Spacing.xl, paddingBottom: 40 },
  fieldLabel: { ...Typography.captionStrong, marginBottom: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    minWidth: '30%',
  },
  priorityRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  priorityBtn: {
    flex: 1, borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: Spacing.sm, alignItems: 'center',
    minWidth: '20%',
  },
});
