import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useGooglePlaces } from '../../hooks/useGooglePlaces';
import { getReviewsForPlace } from '../../services/firebase/firestore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const { getDetails, isLoading } = useGooglePlaces();
  const [place, setPlace] = React.useState<any>(null);
  const [reviews, setReviews] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (id) {
      getDetails(id as string).then(setPlace);
      getReviewsForPlace(id as string).then(setReviews);
    }
  }, [id]);

  const openMaps = () => {
    if (place?.location) {
      Linking.openURL(`https://maps.google.com/?q=${place.location.latitude},${place.location.longitude}`);
    }
  };
  
  const callPhone = () => {
    if (place?.nationalPhoneNumber) {
      Linking.openURL(`tel:${place.nationalPhoneNumber}`);
    }
  };

  if (isLoading || !place) return <LoadingSpinner fullScreen />;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imagePlaceholder}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Ionicons name="image-outline" size={64} color="#ccc" />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{place.displayName?.text}</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>⭐ {place.rating} Google</Text></View>
            <View style={[styles.badge, styles.badgeApp]}><Text style={[styles.badgeText, {color: Colors.surface}]}>⭐ Let's Eat</Text></View>
          </View>

          <Text style={styles.subtitle}>{place.priceLevel} • {place.types?.[0]}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{place.formattedAddress}</Text>
          </View>
          
          <TouchableOpacity style={styles.infoRow} onPress={callPhone}>
            <Ionicons name="call" size={20} color={Colors.primary} />
            <Text style={[styles.infoText, { color: Colors.primary }]}>{place.nationalPhoneNumber || 'N/A'}</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{place.currentOpeningHours?.openNow ? 'Aberto agora' : 'Fechado'}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={openMaps}>
              <Ionicons name="map" size={20} color={Colors.surface} />
              <Text style={styles.actionBtnText}>{t('restaurant.map', 'Ver no mapa')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={callPhone}>
              <Ionicons name="call" size={20} color={Colors.primary} />
              <Text style={[styles.actionBtnText, {color: Colors.primary}]}>{t('restaurant.call', 'Ligar')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t('restaurant.communityReviews', 'Avaliações da Comunidade')}</Text>
          {reviews.length === 0 ? (
            <Text style={styles.emptyReviews}>{t('restaurant.noReviews', 'Seja o primeiro a avaliar!')}</Text>
          ) : (
            reviews.map((r, i) => (
              <View key={i} style={{ marginBottom: Spacing.md }}>
                <Text style={{ ...Typography.body1 }}>⭐ {r.rating} - {r.userDisplayName}</Text>
                <Text style={{ ...Typography.body2, color: Colors.textSecondary }}>{r.comment}</Text>
              </View>
            ))
          )}
          <View style={{height: 100}} />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push(`/write-review/${id}`)}
      >
        <Ionicons name="pencil" size={24} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  imagePlaceholder: { width: '100%', height: 280, backgroundColor: Colors.lightGray, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: Spacing.lg, backgroundColor: Colors.surface, padding: Spacing.sm, borderRadius: BorderRadius.full, elevation: 4 },
  content: { padding: Spacing.xxl, marginTop: -20, backgroundColor: Colors.surface, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl },
  title: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
  ratingRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  badge: { backgroundColor: Colors.lightGray, paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.lg },
  badgeApp: { backgroundColor: Colors.primary },
  badgeText: { fontFamily: Typography.fontFamily.semiBold, color: Colors.text },
  subtitle: { ...Typography.h3, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  infoText: { ...Typography.body1, color: Colors.text, marginLeft: Spacing.md },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl, marginBottom: Spacing.xxl },
  actionBtn: { flex: 1, backgroundColor: Colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: BorderRadius.md },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  actionBtnText: { color: Colors.surface, ...Typography.body1, fontFamily: Typography.fontFamily.bold, marginLeft: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.xxl },
  sectionTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.lg },
  emptyReviews: { color: Colors.textSecondary, fontStyle: 'italic', ...Typography.body2 },
  fab: { position: 'absolute', bottom: Spacing.xxl, right: Spacing.xxl, width: 64, height: 64, borderRadius: BorderRadius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
});
