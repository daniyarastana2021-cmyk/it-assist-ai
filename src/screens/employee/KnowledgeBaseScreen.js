import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import EmptyState from '../../components/common/EmptyState';
import { getArticles } from '../../services/kbService';
import { TICKET_CATEGORIES } from '../../config/constants';

const ALL = { id: 'all', label: 'Все' };

export default function KnowledgeBaseScreen({ navigation }) {
  const { colors } = useTheme();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await getArticles(category === 'all' ? null : category);
      setArticles(data);
    } catch {}
  }

  useEffect(() => { load(); }, [category]);

  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  const filtered = search
    ? articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || (a.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase())))
    : articles;

  const categories = [ALL, ...TICKET_CATEGORIES];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>📚 База знаний</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Инструкции и решения</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={{ color: colors.textDisabled }}>🔍 </Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по статьям..."
            placeholderTextColor={colors.textDisabled}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats}>
        {categories.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catChip, { backgroundColor: category === c.id ? colors.primary : colors.surface, borderColor: category === c.id ? colors.primary : colors.border }]}
            onPress={() => setCategory(c.id)}
          >
            <Text style={{ color: category === c.id ? '#FFF' : colors.textSecondary, fontSize: 12, fontWeight: '500' }}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {filtered.length === 0 ? (
          <EmptyState emoji="🔍" title="Статьи не найдены" subtitle="Попробуйте другой запрос или категорию" />
        ) : (
          filtered.map(article => (
            <TouchableOpacity
              key={article.id}
              style={[styles.article, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Article', { articleId: article.id })}
            >
              <View style={styles.articleHeader}>
                <View style={[styles.catBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>
                    {TICKET_CATEGORIES.find(c => c.id === article.category)?.label || article.category}
                  </Text>
                </View>
                <Text style={[Typography.small, { color: colors.textDisabled }]}>{article.views || 0} просмотров</Text>
              </View>
              <Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
              {article.tags?.length > 0 && (
                <View style={styles.tags}>
                  {article.tags.map(tag => (
                    <View key={tag} style={[styles.tag, { backgroundColor: colors.background }]}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1 },
  title: { ...Typography.title3, marginBottom: 2 },
  subtitle: { ...Typography.caption, marginBottom: Spacing.md },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1, paddingHorizontal: Spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: Spacing.md, ...Typography.body },
  cats: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, maxHeight: 56 },
  catChip: { borderRadius: Radius.round, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 6, marginRight: Spacing.sm },
  list: { padding: Spacing.lg },
  article: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginBottom: Spacing.md },
  articleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  catBadge: { borderRadius: Radius.round, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  articleTitle: { ...Typography.bodyStrong, marginBottom: Spacing.sm },
  tags: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  tag: { borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
});
