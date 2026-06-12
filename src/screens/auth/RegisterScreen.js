import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography, Spacing, Radius } from '../../theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerUser } from '../../services/authService';
import { USER_ROLES } from '../../config/constants';

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!name || !email || !password) { setError('Заполните все поля'); return; }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    setLoading(true);
    setError('');
    try {
      await registerUser(email, password, name, USER_ROLES.EMPLOYEE);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') setError('Email уже используется');
      else setError('Ошибка регистрации. Попробуйте снова.');
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ color: colors.primary, ...Typography.body }}>← Назад</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.icon, { backgroundColor: colors.primary }]}>
            <Text style={styles.iconText}>IT</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Создать аккаунт</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Зарегистрируйтесь в IT Assist AI
          </Text>

          <Input label="Полное имя" value={name} onChangeText={setName} placeholder="Иван Иванов" autoCapitalize="words" />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="ivan@company.kz" keyboardType="email-address" />
          <Input label="Пароль" value={password} onChangeText={setPassword} placeholder="Минимум 6 символов" secureTextEntry />

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.errorLight }]}>
              <Text style={[{ color: colors.error }, Typography.caption]}>{error}</Text>
            </View>
          ) : null}

          <Button title="Зарегистрироваться" onPress={handleRegister} loading={loading} style={{ marginTop: Spacing.sm }} />
        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary, ...Typography.body }}>Уже есть аккаунт? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.primary, fontWeight: '600', ...Typography.body }}>Войти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  back: { marginBottom: Spacing.lg },
  card: { borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.xxl, marginBottom: Spacing.lg },
  icon: { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  iconText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  title: { ...Typography.title3, marginBottom: Spacing.xs },
  subtitle: { ...Typography.body, marginBottom: Spacing.xl },
  errorBox: { borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
