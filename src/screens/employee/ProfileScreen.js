import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Typography, Spacing, Radius } from '../../theme';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import { USER_ROLES } from '../../config/constants';

function MenuItem({ icon, label, value, onPress, colors, isSwitch, switchValue, onSwitchChange }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!!isSwitch}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ true: colors.primary }} />
      ) : (
        <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value || '→'}</Text>
      )}
    </TouchableOpacity>
  );
}

const ROLE_LABELS = { employee: 'Сотрудник', engineer: 'IT Инженер', admin: 'Администратор' };

export default function ProfileScreen() {
  const { colors, scheme, setScheme } = useTheme();
  const { profile, user } = useAuth();
  const isDark = scheme === 'dark';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={[styles.avatarRing, { borderColor: 'rgba(255,255,255,0.4)' }]}>
          <Avatar name={profile?.displayName || 'U'} size={72} />
        </View>
        <Text style={styles.name}>{profile?.displayName || 'Сотрудник'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.roleText}>{ROLE_LABELS[profile?.role] || 'Сотрудник'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Account */}
        <Text style={[styles.section, { color: colors.textSecondary }]}>АККАУНТ</Text>
        <Card noPadding>
          <MenuItem icon="👤" label="Имя" value={profile?.displayName} colors={colors} />
          <MenuItem icon="📧" label="Email" value={user?.email} colors={colors} />
          <MenuItem icon="🏢" label="Отдел" value={profile?.department || 'Не указан'} colors={colors} />
          <MenuItem icon="💼" label="Должность" value={profile?.position || 'Не указана'} colors={colors} />
        </Card>

        {/* Preferences */}
        <Text style={[styles.section, { color: colors.textSecondary }]}>НАСТРОЙКИ</Text>
        <Card noPadding>
          <MenuItem
            icon={isDark ? '🌙' : '☀️'}
            label="Тёмная тема"
            colors={colors}
            isSwitch
            switchValue={isDark}
            onSwitchChange={v => setScheme(v ? 'dark' : 'light')}
          />
          <MenuItem icon="🔔" label="Уведомления" value="Включены" colors={colors} onPress={() => {}} />
          <MenuItem icon="🌐" label="Язык" value="Русский" colors={colors} onPress={() => {}} />
        </Card>

        {/* Info */}
        <Text style={[styles.section, { color: colors.textSecondary }]}>О ПРИЛОЖЕНИИ</Text>
        <Card noPadding>
          <MenuItem icon="ℹ️" label="IT Assist AI" value="v1.0.0" colors={colors} />
          <MenuItem icon="📋" label="Политика конфиденциальности" colors={colors} onPress={() => {}} />
          <MenuItem icon="📞" label="Поддержка" value="it@company.kz" colors={colors} />
        </Card>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', padding: Spacing.xl, paddingTop: 60, paddingBottom: Spacing.xxxl },
  avatarRing: { borderRadius: 46, borderWidth: 3, padding: 3, marginBottom: Spacing.md },
  name: { color: '#FFF', ...Typography.title3, marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.7)', ...Typography.caption, marginBottom: Spacing.sm },
  roleBadge: { borderRadius: Radius.round, paddingHorizontal: Spacing.md, paddingVertical: 4 },
  roleText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  section: { ...Typography.small, fontWeight: '600', letterSpacing: 0.5, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, borderBottomWidth: 1,
  },
  menuIcon: { fontSize: 18, width: 24 },
  menuLabel: { flex: 1, ...Typography.body },
  menuValue: { ...Typography.caption },
  logoutBtn: {
    borderRadius: Radius.lg, borderWidth: 1.5,
    padding: Spacing.lg, alignItems: 'center',
    marginTop: Spacing.xl,
  },
});
