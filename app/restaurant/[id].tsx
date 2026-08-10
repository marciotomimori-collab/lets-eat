import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useGooglePlaces } from '../../hooks/useGooglePlaces';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StarRating from '../../components/ui/StarRating';
import Button from '../../components/ui/Button';
import { formatPriceLevel } from '../../utils/formatters';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { getDetails, isLoading } = useGooglePlaces();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'sobre' | 'avaliacoes' | 'fotos'>('sobre');

  useEffect(() => {
    if (id) {
      getDetails(id).then(setRestaurant).catch(console.error);
    }
  }, [id, getDetails]);

  if (isLoading || !restaurant) {
    return <LoadingSpinner fullScreen />;
  }

  const handleOpenMap = () => {
    const lat = restaurant.location?.latitude;
    const lng = restaurant.location?.longitude;
    const url = Platform.select({
      ios: `maps:0,0?q=${restaurant.displayName?.text}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${restaurant.displayName?.text})`
    });
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) Linking.openURL(url);
      });
    }
  };

  const handleCall = () => {
    if (restaurant.nationalPhoneNumber) {
      Linking.openURL(`tel:${restaurant.nationalPhoneNumber}`);
    }
  };

  const priceStr = restaurant.priceLevel ? formatPriceLevel(restaurant.priceLevel) : '';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroContainer}>
          <View style={styles.heroPlaceholder}>
            <Text style={{ fontSize: 64 }}>🍽️</Text>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.title}>{restaurant.displayName?.text}</Text>
          <View style={styles.statsRow}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.statsText}> {restaurant.rating} ({restaurant.userRatingCount})</Text>
            {restaurant.types?.[0] && <Text style={styles.statsText}> • {restaurant.types[0].replace(/_/g, ' ')}</Text>}
            {priceStr ? <Text style={styles.statsText}> • {priceStr}</Text> : null}
          </View>

          <View style={styles.tabsRow}>
            <TouchableOpacity onPress={() => setActiveTab('sobre')} style={[styles.tab, activeTab === 'sobre' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'sobre' && styles.activeTabText]}>{t('restaurant.about', 'Sobre')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('avaliacoes')} style={[styles.tab, activeTab === 'avaliacoes' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'avaliacoes' && styles.activeTabText]}>{t('restaurant.reviews', 'Avaliações')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('fotos')} style={[styles.tab, activeTab === 'fotos' && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === 'fotos' && styles.activeTabText]}>{t('restaurant.photos', 'Fotos')}</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'sobre' && (
            <View style={styles.tabContent}>
              <TouchableOpacity style={styles.infoRow} onPress={handleOpenMap}>
                <Ionicons name="location-outline" size={24} color={Colors.primary} />
                <Text style={styles.infoText}>{restaurant.formattedAddress}</Text>
              </TouchableOpacity>
              
              {restaurant.nationalPhoneNumber && (
                <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
                  <Ionicons name="call-outline" size={24} color={Colors.primary} />
                  <Text style={styles.infoText}>{restaurant.nationalPhoneNumber}</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={24} color={Colors.primary} />
                <Text style={[styles.infoText, { color: restaurant.currentOpeningHours?.openNow ? Colors.success : Colors.error }]}>
                  {restaurant.currentOpeningHours?.openNow ? t('restaurant.open', 'Aberto agora') : t('restaurant.closed', 'Fechado')}
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'avaliacoes' && (
            <View style={styles.tabContent}>
              <View style={styles.ratingOverview}>
                <View style={styles.ratingNumberContainer}>
                  <Text style={styles.ratingBigNumber}>{restaurant.rating?.toFixed(1) || '0.0'}</Text>
                  <StarRating rating={restaurant.rating || 0} size={16} />
                  <Text style={styles.reviewCountText}>{restaurant.userRatingCount || 0} avaliações</Text>
                </View>
                
                <View style={styles.ratingBarsContainer}>
                  {[5,4,3,2,1].map(star => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarText}>{star}</Text>
                      <View style={styles.ratingBarBackground}>
                        <View style={[styles.ratingBarFill, { width: `${(star / 5) * 100}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <Button 
                title={t('restaurant.writeReviewBtn', 'Avaliar restaurante')} 
                onPress={() => router.push(`/write-review/${id}`)}
                style={{ marginBottom: Spacing.xl }}
              />

              <Text style={styles.sectionTitle}>{t('restaurant.userReviews', 'Comentários')}</Text>
              
              {restaurant.reviews?.map((r: any, idx: number) => (
                <View key={idx} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{r.authorAttribution?.displayName?.charAt(0) || 'U'}</Text>
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{r.authorAttribution?.displayName || 'Usuário'}</Text>
                      <Text style={styles.reviewTime}>{r.relativePublishTimeDescription}</Text>
                    </View>
                  </View>
                  <View style={{ marginBottom: Spacing.xs }}>
                    <StarRating rating={r.rating} size={14} />
                  </View>
                  <Text style={styles.reviewText}>{r.text?.text || r.text}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'fotos' && (
            <View style={styles.tabContent}>
              <View style={styles.emptyState}>
                <Ionicons name="images-outline" size={48} color={Colors.border} />
                <Text style={styles.emptyText}>{t('restaurant.noPhotos', 'Nenhuma foto disponível.')}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push(`/write-review/${id}`)}
      >
        <Ionicons name="pencil" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  heroContainer: { height: 200, width: '100%', position: 'relative' },
  heroPlaceholder: { flex: 1, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    marginTop: -24,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    minHeight: 500,
  },
  title: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.xs },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  statsText: { ...Typography.body2, color: Colors.textSecondary },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { ...Typography.body, color: Colors.textSecondary },
  activeTabText: { fontFamily: Typography.fontFamily.semiBold, color: Colors.primary },
  tabContent: { flex: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  infoText: { ...Typography.body, color: Colors.text, marginLeft: Spacing.md, flex: 1 },
  
  ratingOverview: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  ratingNumberContainer: { alignItems: 'center', marginRight: Spacing.xl },
  ratingBigNumber: { ...Typography.display, color: Colors.text },
  reviewCountText: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs },
  ratingBarsContainer: { flex: 1 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingBarText: { ...Typography.caption, color: Colors.textSecondary, width: 12 },
  ratingBarBackground: { flex: 1, height: 6, backgroundColor: Colors.lightGray, borderRadius: 3, marginLeft: Spacing.sm },
  ratingBarFill: { height: '100%', backgroundColor: Colors.star, borderRadius: 3 },
  
  sectionTitle: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.md },
  reviewItem: { marginBottom: Spacing.xl },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  avatarText: { color: Colors.white, ...Typography.label },
  reviewerInfo: { flex: 1 },
  reviewerName: { ...Typography.label, color: Colors.text },
  reviewTime: { ...Typography.caption, color: Colors.textSecondary },
  reviewText: { ...Typography.body2, color: Colors.text },
  
  emptyState: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyText: { marginTop: Spacing.lg, color: Colors.textSecondary, ...Typography.body },
  
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  }
});
