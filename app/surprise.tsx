import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';
import { useGooglePlaces } from '../hooks/useGooglePlaces';
import { RestaurantCardData } from '../types/restaurant';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SurpriseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];
  const { searchNearby, isLoading } = useGooglePlaces();
  const [result, setResult] = useState<RestaurantCardData | null>(null);

  const handleReveal = async () => {
    // arbitrary lat lng for testing
    const places = await searchNearby({ locationRestriction: { circle: { center: { latitude: -23.5505, longitude: -46.6333 }, radius: 5000.0 } } });
    if (places.length > 0) {
      setResult(places[Math.floor(Math.random() * places.length)]);
    }
    setRevealed(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleReset = () => {
    slideAnim.setValue(100);
    setRevealed(false);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('surprise.title', 'Surpreenda-me!')}</Text>
      
      <View style={styles.filters}>
        <Text style={styles.badge}>⭐ {t('surprise.badge', 'Apenas restaurantes 4.5+')}</Text>
      </View>
      
      <View style={styles.center}>
        {!revealed ? (
          <TouchableOpacity style={styles.surpriseBtn} onPress={handleReveal} activeOpacity={0.8} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : (
              <>
                <Ionicons name="restaurant" size={64} color={Colors.surface} />
                <Text style={styles.surpriseText}>{t('surprise.button', 'Revelar')}</Text>
              </>
            )}
          </TouchableOpacity>
        ) : result ? (
          <Animated.View style={[styles.resultCard, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={48} color={Colors.textSecondary} />
            </View>
            <Text style={styles.resultTitle}>{result.name}</Text>
            <Text style={styles.resultDetails}>⭐ {result.rating} | {result.priceLevel} • {result.types?.[0]}</Text>
            
            <TouchableOpacity style={styles.goBtn} onPress={() => router.push(`/restaurant/${result.placeId}`)}>
              <Text style={styles.goBtnText}>{t('surprise.viewDetails', 'Ver Detalhes')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dislikeBtn} onPress={handleReset}>
              <Text style={styles.dislikeText}>{t('surprise.dislike', 'Não curtiu? Tentar outro')}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View>
            <Text style={styles.resultTitle}>{t('surprise.noResults', 'Nenhum resultado.')}</Text>
            <TouchableOpacity style={styles.dislikeBtn} onPress={handleReset}>
              <Text style={styles.dislikeText}>{t('common.retry', 'Tentar novamente')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 80, paddingHorizontal: Spacing.lg },
  header: { ...Typography.h1, textAlign: 'center', color: Colors.primary, marginBottom: Spacing.xxl },
  filters: { alignItems: 'center', marginBottom: 60 },
  badge: { backgroundColor: Colors.warning + '30', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.xl, fontFamily: Typography.fontFamily.bold, color: Colors.warning },
  center: { flex: 1, alignItems: 'center', paddingTop: Spacing.xl },
  surpriseBtn: { width: 220, height: 220, borderRadius: 110, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 12, shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  surpriseText: { color: Colors.surface, ...Typography.h3, marginTop: Spacing.md },
  resultCard: { width: '100%', backgroundColor: Colors.surface, borderRadius: BorderRadius.xxl, padding: Spacing.xxl, elevation: 8, shadowColor: Colors.shadow, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: 160, backgroundColor: Colors.lightGray, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  resultTitle: { ...Typography.h2, marginBottom: Spacing.sm, color: Colors.text, textAlign: 'center' },
  resultDetails: { ...Typography.body1, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  goBtn: { width: '100%', backgroundColor: Colors.primary, paddingVertical: Spacing.lg, borderRadius: BorderRadius.md, alignItems: 'center' },
  goBtnText: { color: Colors.surface, fontFamily: Typography.fontFamily.bold, fontSize: 18 },
  dislikeBtn: { marginTop: Spacing.xxl, padding: Spacing.sm },
  dislikeText: { color: Colors.textSecondary, textDecorationLine: 'underline', ...Typography.body1 }
});
