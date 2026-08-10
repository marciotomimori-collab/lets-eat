import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { User } from 'firebase/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setUser } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError(t('register.error_empty', 'Por favor, preencha todos os campos.'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.error_password', 'A senha deve ter no mínimo 6 caracteres.'));
      return;
    }

    setLoading(true);
    setError('');

    // Mock register
    setTimeout(() => {
      const mockUser = {
        uid: 'email-user-123',
        isAnonymous: false,
        email: email,
        displayName: name,
      } as unknown as User;

      setUser(mockUser);
      router.replace('/(auth)/onboarding');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('register.title', 'Criar conta')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Input
              label={t('register.name', 'Nome')}
              placeholder={t('register.name_placeholder', 'Seu nome')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label={t('register.email', 'E-mail')}
              placeholder={t('register.email_placeholder', 'seu@email.com')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label={t('register.password', 'Senha')}
              placeholder={t('register.password_placeholder', '••••••••')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={password.length > 0 && password.length < 6 ? t('register.password_helper', 'Mínimo 6 caracteres') : undefined}
            />

            <Button
              title={t('register.submit', 'Criar conta')}
              onPress={handleRegister}
              variant="primary"
              fullWidth
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')} style={styles.footer}>
          <Text style={styles.footerText}>
            {t('register.has_account', 'Já tem uma conta? ')}
            <Text style={styles.footerLink}>{t('register.login', 'Entrar')}</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  errorText: {
    ...Typography.body2,
    color: Colors.error,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  footerLink: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
