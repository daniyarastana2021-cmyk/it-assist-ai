import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import LoadingScreen from '../../components/common/LoadingScreen';
import { getArticleById, rateArticle } from '../../services/kbService';

export default function ArticleScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [rated, setRated] = useState(null);

  useEffect(() => {
    getArticleById(articleId).then(setArticle).catch(() => navigation.goBack());
  }, [articleId]);

  async function handleRate(helpful) {
    if (rated !== null) return;
    setRated(helpful);
    await rateArticle(articleId, helpful);
    Alert.alert(helpful ? '👍 Спасибо!' : '👎 Жаль', 'Ваша оценка поможет улучшить базу знаний.');
  }

  if (!article) return <LoadingScreen />;

  // Simple markdown-like rendering
  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('## '))
        return <Text key={i} style={[styles.h2, { color: colors.text }]}>{line.slice(3)}</Text>;
      if (line.startsWith('**') && line.endsWith('**'))
        return <Text key={i} style={[styles.bold, { color: colors.text }]}>{line.slice(2, -2)}</Text>;
      if (line.startsWith('- '))
        return (
          <View key={i} style={styles.listItem}>
            <Text style={{ color: colors.primary }}>• </Text>
            <Text style={[styles.body, { color: colors.text }]}>{line.slice(2)}</Text>
          </View>
        );
      if (line.trim() === '') return <View key={i} style={{ height: Spacing.sm }} />;
      return <Text key={i} style={[styles.body, { color: colors.text }]}>{line}</Text>;
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, ...Typography.body }}>← Назад</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.textSecondary, ...Typography.caption }}>{article.views} просмотров</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
        {renderContent(article.content)}

        <View style={[styles.rateBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.rateTitle, { color: colors.text }]}>Статья была полезной?</Text>
          <View style={styles.rateButtons}>
            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: rated === true ? colors.successLight : colors.background, borderColor: colors.success }]}
              onPress={() => handleRate(true)}
            >
              <Text style={{ fontSize: 18 }}>👍</Text>
              <Text style={{ color: colors.success, fontWeight: '600' }}>Да ({article.helpful || 0})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rateBtn, { backgroundColor: rated === false ? colors.errorLight : colors.background, borderColor: colors.error }]}
              onPress={() => handleRate(false)}
            >
              <Text style={{ fontSize: 18 }}>👎</Text>
              <Text style={{ color: colors.error, fontWeight: '600' }}>Нет ({article.notHelpful || 0})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg, paddingTop: 52, borderBottomWidth: 1,
  },
  content: { padding: Spacing.xl, paddingBottom: 40 },
  title: { ...Typography.title3, marginBottom: Spacing.xl },
  h2: { fontSize: 18, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.sm },
  bold: { fontWeight: '700', marginBottom: 2 },
  body: { ...Typography.body, marginBottom: 4 },
  listItem: { flexDirection: 'row', marginBottom: 4 },
  rateBox: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, marginTop: Spacing.xxl },
  rateTitle: { ...Typography.headline, marginBottom: Spacing.md, textAlign: 'center' },
  rateButtons: { flexDirection: 'row', gap: Spacing.md },
  rateBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 1.5, paddingVertical: Spacing.md,
  },
});
