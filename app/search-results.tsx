import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useGooglePlaces } from '../hooks/useGooglePlaces';
import { useSearchStore } from '../stores/searchStore';
import { RestaurantCardData } from '../types/restaurant';
import { RestaurantCard } from '../components/home/RestaurantCard';
import { useLocation } from '../hooks/useLocation';

export default function SearchResultsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { searchNearby, isLoading: isSearching, error } = useGooglePlaces();
  const { selectedCuisines, selectedEventType, searchRadius } = useSearchStore();
  const { latitude, longitude, isLoading: isLocationLoading } = useLocation();
  const [results, setResults] = useState<RestaurantCardData[]>([]);

  const isLoading = isSearching || isLocationLoading;

  useEffect(() => {
    if (latitude && longitude) {
      searchNearby({
        latitude,
        longitude,
        radius: (searchRadius || 5) * 1000,
        // Optional mapping based on included types can be added here
      }).then(data => {
        setResults(data);
      });
    }
  }, [latitude, longitude, selectedCuisines, selectedEventType, searchRadius]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{results.length} {t('search.resultsFound', 'resultados encontrados')}</Text>
      </View>
      
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList 
          data={results}
          keyExtractor={(item) => item.placeId}
          renderItem={({item}) => (
            <View style={{ marginHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
              <RestaurantCard data={item} onPress={(id) => router.push(`/restaurant/${id}`)} />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>{t('search.noResults', 'Nenhum restaurante encontrado')}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
                <Text style={styles.retryText}>{t('common.retry', 'Tentar novamente')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 50, paddingBottom: Spacing.lg, backgroundColor: Colors.surface, elevation: 2 },
  backBtn: { marginRight: Spacing.lg },
  headerTitle: { ...Typography.h3, color: Colors.text },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 150 },
  emptyText: { marginTop: Spacing.lg, color: Colors.textSecondary, ...Typography.body1, marginBottom: Spacing.xxl },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: BorderRadius.sm },
  retryText: { color: Colors.surface, fontFamily: Typography.fontFamily.bold },
  card: { padding: Spacing.lg, backgroundColor: Colors.surface, margin: Spacing.lg, borderRadius: BorderRadius.sm },
  errorText: { color: Colors.error, fontFamily: Typography.fontFamily.semiBold }
});
