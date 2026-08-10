import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { useUserStore } from '../../stores/userStore';

export default function OnboardingSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setOnboardingComplete } = useUserStore();

  const handleFinish = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  const handleSettings = () => {
    setOnboardingComplete(true);
    router.replace('/(tabs)/settings');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={64} color={Colors.white} />
          </View>

          <Text style={styles.title}>
            {t('onboarding_success.title', 'Tudo pronto!')}
          </Text>
          <Text style={styles.subtitle}>
            {t('onboarding_success.subtitle', 'Seu perfil foi salvo com sucesso.')}
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('onboarding_success.lets_eat', 'Vamos comer!')}
            onPress={handleFinish}
            variant="primary"
            fullWidth
            style={styles.primaryButton}
          />
          <Button
            title={t('onboarding_success.settings', 'Ir para configurações')}
            onPress={handleSettings}
            variant="ghost"
            fullWidth
          />
        </View>
      </View>
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
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    paddingBottom: Spacing.xl,
  },
  primaryButton: {
    marginBottom: Spacing.md,
  },
});
