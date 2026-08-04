import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Slider } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/colors';
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

export const SearchForm: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<string[]>([]);
  const [radius, setRadius] = useState<number>(5);

  const toggleCuisine = (id: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const togglePrice = (level: string) => {
    setSelectedPriceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
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
            key={cuisine.id}
            label={t(`cuisines.${cuisine.id}`, cuisine.label)}
            selected={selectedCuisines.includes(cuisine.id)}
            onPress={() => toggleCuisine(cuisine.id)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('search.eventType', 'Ocasião')}</Text>
      <View style={styles.chipContainer}>
        {EVENT_TYPES.map((event) => (
          <Chip
            key={event.id}
            label={t(`events.${event.id}`, event.label)}
            selected={selectedEventType === event.id}
            onPress={() => setSelectedEventType(event.id === selectedEventType ? null : event.id)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('search.priceLevel', 'Preço')}</Text>
      <View style={styles.chipContainer}>
        {PRICE_LEVELS.map((price) => (
          <Chip
            key={price.id}
            label={price.label}
            selected={selectedPriceLevels.includes(price.id)}
            onPress={() => togglePrice(price.id)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('search.distance', 'Distância')}: {radius} km
      </Text>
      <View style={styles.radiusControls}>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={15}
          step={1}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.lightGray}
          thumbTintColor={Colors.primary}
        />
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
