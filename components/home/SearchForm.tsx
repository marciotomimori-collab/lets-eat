import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Spacing, Typography } from '../../constants/theme';
import { CUISINE_TYPES } from '../../constants/cuisineTypes';
import { EVENT_TYPES, PRICE_LEVELS } from '../../constants/eventTypes';
import Button from '../ui/Button'; 
import Chip from '../ui/Chip'; 

export interface SearchFilters {
  cuisines: string[];
  eventType: string | null;
  priceLevels: string[];
  radius: number;
}

interface Props {
  onSubmit: (filters: SearchFilters) => void;
}

const RADIUS_OPTIONS = [1, 3, 5, 10, 15];

export const SearchForm: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(5);

  const toggleCuisine = (key: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const togglePrice = (key: string) => {
    setSelectedPriceLevels((prev) =>
      prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]
    );
  };

  const handleSearch = () => {
    onSubmit({
      cuisines: selectedCuisines,
      eventType: selectedEventType,
      priceLevels: selectedPriceLevels,
      radius,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>{t('search.cuisineType', 'Tipo de Comida')}</Text>
      <View style={styles.chipContainer}>
        {CUISINE_TYPES.map((cuisine) => (
          <Chip
            key={cuisine.key}
            label={t(`cuisines.${cuisine.key}`, cuisine.labelPt)}
            selected={selectedCuisines.includes(cuisine.key)}
            onPress={() => toggleCuisine(cuisine.key)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('search.eventType', 'Ocasião')}</Text>
      <View style={styles.chipContainer}>
        {EVENT_TYPES.map((event) => (
          <Chip
            key={event.key}
            label={t(`events.${event.key}`, event.labelPt)}
            selected={selectedEventType === event.key}
            onPress={() => setSelectedEventType(event.key === selectedEventType ? null : event.key)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('search.priceLevel', 'Preço')}</Text>
      <View style={styles.chipContainer}>
        {PRICE_LEVELS.map((price) => (
          <Chip
            key={price.key}
            label={price.label}
            selected={selectedPriceLevels.includes(price.key)}
            onPress={() => togglePrice(price.key)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('search.distance', 'Distância')}: {radius} km
      </Text>
      <View style={styles.radiusControls}>
        <View style={styles.chipContainer}>
          {RADIUS_OPTIONS.map((opt) => (
            <Chip
              key={opt.toString()}
              label={`${opt} km`}
              selected={radius === opt}
              onPress={() => setRadius(opt)}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title={t('search.button', 'Buscar')} onPress={handleSearch} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  radiusControls: {
    marginVertical: Spacing.md,
  },
  footer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
});
