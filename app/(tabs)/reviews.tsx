import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getReviewsByUser } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StarRating from '../../components/ui/StarRating';
import Chip from '../../components/ui/Chip';

export default function ReviewsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.uid) {
      getReviewsByUser(user.uid)
        .then((data) => {
          setReviews(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  const filteredReviews = reviews.filter(r => 
    r.placeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filters = ['Todas', 'Italiana', 'Japonesa', '$$$'];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('reviews.title', 'Avaliações')}</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="search" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput 
          style={styles.searchInput}
          placeholder={t('reviews.searchPlaceholder', 'Buscar restaurantes...')}
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map(f => (
            <Chip 
              key={f}
              label={f}
              selected={activeFilter === f}
              onPress={() => setActiveFilter(f)}
              style={styles.chip}
            />
          ))}
        </ScrollView>
      </View>
      
      <FlatList 
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push(`/restaurant/${item.placeId}`)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.placeName}</Text>
            </View>
            
            <View style={styles.ratingRow}>
              <StarRating rating={item.rating} size={16} />
              <Text style={styles.ratingNumber}>{item.rating.toFixed(1)}</Text>
            </View>
            
            <Text style={styles.cardSubtitle}>
              {item.eventType || 'Geral'} • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            
            {item.comment ? (
              <Text style={styles.comment} numberOfLines={2}>{item.comment}</Text>
            ) : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>{t('reviews.empty', 'Nenhuma avaliação encontrada.')}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    paddingTop: 60, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: { 
    ...Typography.h1, 
    color: Colors.text 
  },
  headerIcon: {
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.md, 
    paddingHorizontal: Spacing.md, 
    height: 48, 
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: Spacing.sm, 
    ...Typography.body, 
    color: Colors.text 
  },
  filterWrapper: {
    marginBottom: Spacing.md,
  },
  filterRow: { 
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    marginRight: Spacing.xs,
  },
  card: { 
    padding: Spacing.lg, 
    borderRadius: BorderRadius.lg, 
    backgroundColor: Colors.surface, 
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md, 
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardTitle: { 
    ...Typography.h3, 
    color: Colors.text,
    flex: 1,
  },
  ratingRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ratingNumber: {
    ...Typography.label,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  cardSubtitle: { 
    ...Typography.body2, 
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  comment: {
    ...Typography.body1,
    color: Colors.text,
    fontStyle: 'italic',
  },
  listContent: { 
    paddingBottom: Spacing.xxxl, 
    flexGrow: 1,
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
    ...Typography.body 
  }
});
