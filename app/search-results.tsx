import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
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
      }).then(data => {
        setResults(data);
      });
    }
  }, [latitude, longitude, selectedCuisines, selectedEventType, searchRadius]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultados</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/search-form' as any)}>
          <Ionicons name="options-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.subheader}>
        <Text style={styles.subtitle}>
          {results.length} restaurantes encontrados
        </Text>
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
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <View style={styles.cardContainer}>
              <RestaurantCard data={item} onPress={(id) => router.push(`/restaurant/${id}`)} />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={Colors.textLight} />
              <Text style={styles.emptyText}>Nenhum restaurante encontrado</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, 
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, 
  },
  backBtn: { 
    padding: Spacing.xs,
  },
  filterBtn: {
    padding: Spacing.xs,
  },
  headerTitle: { 
    ...Typography.h3, 
    color: Colors.text 
  },
  subheader: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  subtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.lg,
  },
  cardContainer: {
    marginBottom: Spacing.lg,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 100 
  },
  emptyText: { 
    marginTop: Spacing.lg, 
    color: Colors.textSecondary, 
    ...Typography.body1, 
    marginBottom: Spacing.xl 
  },
  retryBtn: { 
    backgroundColor: Colors.primary, 
    paddingHorizontal: Spacing.xl, 
    paddingVertical: Spacing.md, 
    borderRadius: BorderRadius.md 
  },
  retryText: { 
    color: Colors.surface, 
    fontFamily: Typography.fontFamily.semiBold 
  },
  errorText: { 
    color: Colors.error, 
    fontFamily: Typography.fontFamily.semiBold 
  }
});
