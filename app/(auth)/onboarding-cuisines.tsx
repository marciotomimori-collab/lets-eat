import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import { useUserStore } from '../../stores/userStore';
import { CUISINE_TYPES } from '../../constants/cuisineTypes';

export default function OnboardingCuisinesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { updateProfile } = useUserStore();

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const toggleCuisine = (key: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleFinish = () => {
    updateProfile({
      foodPreferences: selectedCuisines,
    });
    router.push('/(auth)/onboarding-success' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('onboarding_cuisines.title', 'Quais são seus tipos de comida favoritos?')}
            </Text>
            <Text style={styles.subtitle}>
              {t('onboarding_cuisines.subtitle', 'Selecione suas preferências (você pode alterar depois).')}
            </Text>
          </View>

          <View style={styles.chipsContainer}>
            {CUISINE_TYPES.map((cuisine) => (
              <Chip
                key={cuisine.key}
                label={cuisine.labelPt}
                emoji={cuisine.emoji}
                selected={selectedCuisines.includes(cuisine.key)}
                onPress={() => toggleCuisine(cuisine.key)}
                style={styles.chip}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t('onboarding_cuisines.finish', 'Concluir')}
            onPress={handleFinish}
            variant="primary"
            fullWidth
            disabled={selectedCuisines.length === 0}
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.textSecondary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    marginBottom: Spacing.xs,
  },
  footer: {
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
