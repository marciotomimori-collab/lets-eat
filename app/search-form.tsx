import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import { CUISINE_TYPES } from '../constants/cuisineTypes';
import { EVENT_TYPES, PRICE_LEVELS } from '../constants/eventTypes';
import { useSearchStore } from '../stores/searchStore';

export default function SearchFormScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const { 
    selectedCuisines, 
    selectedEventType, 
    selectedPriceLevels,
    toggleCuisine,
    setSelectedEventType,
    togglePriceLevel,
    resetSearch
  } = useSearchStore();

  const handleSearch = () => {
    router.push('/search-results' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formulário rápido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Cuisine Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de comida</Text>
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
        </View>

        {/* Event Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de evento</Text>
          <View style={styles.chipsContainer}>
            {EVENT_TYPES.map((event) => (
              <Chip
                key={event.key}
                label={event.labelPt}
                emoji={event.emoji}
                selected={selectedEventType === event.key}
                onPress={() => setSelectedEventType(selectedEventType === event.key ? null : event.key)}
                style={styles.chip}
              />
            ))}
          </View>
        </View>

        {/* Price Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faixa de preço</Text>
          <View style={styles.priceContainer}>
            {PRICE_LEVELS.map((price) => {
              const isSelected = selectedPriceLevels.includes(price.key);
              return (
                <TouchableOpacity
                  key={price.key}
                  style={[styles.priceBtn, isSelected && styles.priceBtnSelected]}
                  onPress={() => togglePriceLevel(price.key)}
                >
                  <Text style={[styles.priceBtnText, isSelected && styles.priceBtnTextSelected]}>
                    {price.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Buscar restaurantes" 
          onPress={handleSearch} 
          variant="primary"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    margin: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  priceBtnSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  priceBtnText: {
    ...Typography.body1,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  priceBtnTextSelected: {
    color: Colors.primaryDark,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
