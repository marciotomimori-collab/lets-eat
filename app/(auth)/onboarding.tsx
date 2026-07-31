import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Spacing, Typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Chip from '../../components/ui/Chip';
import { useTranslation } from 'react-i18next';
import { updateUserProfile } from '../../services/firebase/firestore';
import { CUISINE_TYPES } from '../../constants/cuisineTypes';
import { useAuthStore } from '../../stores/useAuthStore';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const toggleCuisine = (cuisineId: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      if (user?.uid) {
        await updateUserProfile(user.uid, {
          name,
          age: parseInt(age, 10) || null,
          preferences: selectedCuisines,
          onboardingComplete: true,
        });
      }
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('onboarding.title', 'Vamos nos conhecer! 👋')}</Text>

      <Input
        label={t('onboarding.name', 'Nome')}
        placeholder="Como quer ser chamado?"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.spacer} />

      <Input
        label={t('onboarding.age', 'Idade')}
        placeholder="Sua idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>
        {t('onboarding.cuisineQuestion', 'Que tipos de comida você curte?')}
      </Text>

      <View style={styles.chipGrid}>
        {CUISINE_TYPES.map((cuisine) => (
          <Chip
            key={cuisine.id}
            label={cuisine.name}
            selected={selectedCuisines.includes(cuisine.id)}
            onPress={() => toggleCuisine(cuisine.id)}
            style={styles.chip}
          />
        ))}
      </View>

      <Button
        title={t('onboarding.continue', 'Continuar')}
        onPress={handleContinue}
        variant="primary"
        loading={isLoading}
        style={styles.button}
      />

      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>{t('onboarding.skip', 'Pular por agora')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.l,
    paddingTop: Spacing.xxl,
  },
  spacer: {
    height: Spacing.m,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.m,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
    marginBottom: Spacing.xl,
  },
  chip: {
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  button: {
    marginTop: Spacing.m,
  },
  skipButton: {
    alignItems: 'center',
    padding: Spacing.m,
    marginTop: Spacing.s,
  },
  skipText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
