import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Radius, Spacing } from '../../theme';

const STATUS_COLORS = key => ({
  new: 'statusNew',
  assigned: 'statusAssigned',
  in_progress: 'statusInProgress',
  resolved: 'statusResolved',
  closed: 'statusClosed',
  critical: 'priorityCritical',
  high: 'priorityHigh',
  medium: 'priorityMedium',
  low: 'priorityLow',
}[key] || 'primary');

export default function Badge({ label, type = 'status', value, style }) {
  const { colors } = useTheme();
  const colorKey = STATUS_COLORS(value);
  const color = colors[colorKey] || colors.primary;

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.round,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600' },
});
