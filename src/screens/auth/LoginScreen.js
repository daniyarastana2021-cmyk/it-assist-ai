import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser } from '../../services/authService';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Заполните все поля'); return; }
    setLoading(true);
    setError('');
    try {
      await loginUser(email, password);
    } catch (e) {
      setError(e.code === 'auth/invalid-credential' ? 'Неверный email или пароль' : 'Ошибка входа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoIconText}>IT</Text>
          </View>
          <Text style={[styles.logoTitle, { color: colors.text }]}>IT Assist AI</Text>
          <Text style={[styles.logoSub, { color: colors.textSecondary }]}>
            Интеллектуальный Service Desk
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Войти в систему</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Используйте корпоративную учётную запись
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="ivan@company.kz"
            keyboardType="email-address"
          />
          <Input
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            placeholder="Введите пароль"
            secureTextEntry
          />

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.errorLight }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}

          <Button title="Войти" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.sm }} />
        </View>

        {/* Register link */}
        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary, ...Typography.body }}>
            Нет аккаунта?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: colors.primary, fontWeight: '600', ...Typography.body }}>
              Зарегистрироваться
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoIcon: {
    width: 72, height: 72, borderRadius: Radius.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  logoIconText: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  logoTitle: { ...Typography.title1, marginBottom: Spacing.xs },
  logoSub: { ...Typography.body },
  card: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  title: { ...Typography.title3, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, marginBottom: Spacing.xl },
  errorBox: { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md },
  errorText: { ...Typography.caption },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
