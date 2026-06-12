import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing } from '../../theme';

export default function EmptyState({ emoji = '📭', title, subtitle, action }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: Spacing.huge, paddingHorizontal: Spacing.xxxl },
  emoji: { fontSize: 48, marginBottom: Spacing.lg },
  title: { ...Typography.headline, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, textAlign: 'center' },
  action: { marginTop: Spacing.xl },
});
