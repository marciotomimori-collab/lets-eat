import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { getReviewsByUser } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RestaurantCard = ({ item, onPress }: { item: any, onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{item.placeName}</Text>
    <Text style={styles.ratingText}>⭐ {item.rating} Avaliação</Text>
    <Text style={styles.detailsText}>{item.comment}</Text>
  </TouchableOpacity>
);

export default function ReviewsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  React.useEffect(() => {
    if (user?.uid) {
      getReviewsByUser(user.uid).then((data) => {
        setReviews(data as any);
      }).catch(console.error).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  if (loading) return <LoadingSpinner fullScreen />;

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
        keyExtractor={(item: any) => item.id}
        renderItem={({item}) => (
          <RestaurantCard 
            item={item} 
            onPress={() => router.push(`/restaurant/${item.placeId}`)} 
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>{t('reviews.empty', 'Nenhuma avaliação encontrada.')}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60, paddingHorizontal: Spacing.lg },
  header: { ...Typography.h1, marginBottom: Spacing.lg, color: Colors.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 48, marginBottom: Spacing.lg },
  searchInput: { flex: 1, marginLeft: Spacing.md, ...Typography.body1 },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.lightGray },
  chipText: { fontFamily: Typography.fontFamily.semiBold, color: Colors.text },
  card: { padding: Spacing.lg, borderRadius: BorderRadius.md, backgroundColor: Colors.surface, marginBottom: Spacing.md, elevation: 2, shadowColor: Colors.shadow, shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { ...Typography.h3, color: Colors.primary, marginBottom: 4 },
  ratingText: { fontFamily: Typography.fontFamily.semiBold, color: Colors.text, marginBottom: 4 },
  detailsText: { ...Typography.body2, color: Colors.textSecondary },
  listContent: { paddingBottom: Spacing.xxl, flexGrow: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: Spacing.lg, color: Colors.textSecondary, ...Typography.body1 }
});
