import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const RestaurantCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.ratingText}>⭐ {item.googleRating} Google | ⭐ {item.appRating} App</Text>
    <Text style={styles.detailsText}>{item.reviewCount} avaliações no app</Text>
    <Text style={styles.detailsText}>{item.priceLevel} • {item.cuisine}</Text>
  </TouchableOpacity>
);

export default function ReviewsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]); // Empty state

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('reviews.title', 'Avaliações')}</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput 
          style={styles.searchInput}
          placeholder={t('reviews.searchPlaceholder', 'Buscar avaliações...')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>{t('filters.type', 'Tipo')}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>{t('filters.price', 'Preço')}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>{t('filters.rating', 'Avaliação')}</Text></TouchableOpacity>
      </View>
      
      <FlatList 
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <RestaurantCard 
            item={item} 
            onPress={() => router.push(`/restaurant/${item.id}`)} 
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>{t('reviews.empty', 'Nenhuma avaliação encontrada.')}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 24, fontFamily: 'Inter-Bold', marginBottom: 16, color: '#333' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, height: 48, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, fontFamily: 'Inter-Regular' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#eee' },
  chipText: { fontFamily: 'Inter-SemiBold', color: '#444' },
  card: { padding: 16, borderRadius: 12, backgroundColor: '#fff', marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: Colors?.primary || '#E53935', marginBottom: 4 },
  ratingText: { fontFamily: 'Inter-SemiBold', color: '#333', marginBottom: 4 },
  detailsText: { fontFamily: 'Inter-Regular', color: '#666' },
  listContent: { paddingBottom: 24, flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: '#666', fontSize: 16, fontFamily: 'Inter-Regular' }
});
