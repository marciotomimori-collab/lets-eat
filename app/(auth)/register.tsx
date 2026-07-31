import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Spacing, Typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { registerWithEmail } from '../../services/firebase/auth';
import { createUserProfile } from '../../services/firebase/firestore';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.includes('@')) newErrors.email = 'E-mail inválido';
    if (password.length < 6) newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    if (!agreed) newErrors.agreed = 'Você deve aceitar a Política de Privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      setIsLoading(true);
      const user = await registerWithEmail(email, password);
      if (user) {
        await createUserProfile(user.uid, { email });
        router.replace('/(auth)/onboarding');
      }
    } catch (error: any) {
      setErrors({ form: error.message || 'Erro ao registrar' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('register.title', 'Criar sua conta')}</Text>

        <View style={styles.form}>
          <Input
            label={t('register.email', 'E-mail')}
            placeholder="Seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label={t('register.password', 'Senha')}
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <Input
            label={t('register.confirmPassword', 'Confirmar senha')}
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>
              {t('register.agreeText', 'Li e aceito a Política de Privacidade')}
            </Text>
          </TouchableOpacity>
          {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}
          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

          <Button
            title={t('register.submit', 'Criar Conta')}
            onPress={handleRegister}
            variant="primary"
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.l,
    flexGrow: 1,
  },
  backButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.l,
  },
  backText: {
    ...Typography.body,
    color: Colors.text,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.m,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: Spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: Colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  },
  submitButton: {
    marginTop: Spacing.l,
  },
});
