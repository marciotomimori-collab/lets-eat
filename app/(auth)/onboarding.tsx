import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { updateProfile } = useUserStore();

  const [name, setName] = useState(user?.displayName || '');
  const [age, setAge] = useState('');

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleContinue = () => {
    updateProfile({
      displayName: name,
      age: age ? parseInt(age, 10) : undefined,
    });
    router.push('/(auth)/onboarding-cuisines' as any);
  };

  const isFormValid = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={Colors.textLight} />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('onboarding.title', 'Complete seu perfil')}</Text>
            <Text style={styles.subtitle}>
              {t('onboarding.subtitle', 'Isso nos ajuda a te mostrar melhores sugestões.')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('onboarding.name', 'Nome')}
              placeholder={t('onboarding.name_placeholder', 'Digite seu nome')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label={t('onboarding.age', 'Idade (opcional)')}
              placeholder={t('onboarding.age_placeholder', 'Selecione sua idade')}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t('onboarding.continue', 'Continuar')}
            onPress={handleContinue}
            variant="primary"
            fullWidth
            disabled={!isFormValid}
          />
        </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: Spacing.md,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
