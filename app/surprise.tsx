import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Colors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useGooglePlaces } from '../hooks/useGooglePlaces';
import { RestaurantCardData } from '../types/restaurant';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLocation } from '../hooks/useLocation';
import Chip from '../components/ui/Chip';
import { EVENT_TYPES, PRICE_LEVELS } from '../constants/eventTypes';
import Button from '../components/ui/Button';

export default function SurpriseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [radius, setRadius] = useState(5);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedPriceLevels, setSelectedPriceLevels] = useState<string[]>([]);
  
  const [revealed, setRevealed] = useState(false);
  const { searchNearby, isLoading: isSearching } = useGooglePlaces();
  const { latitude, longitude, isLoading: isLocationLoading, error: locationError } = useLocation();
  const [result, setResult] = useState<RestaurantCardData | null>(null);

  const isLoading = isSearching || isLocationLoading;
  
  const pan = useRef(new Animated.ValueXY()).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const handleReveal = async () => {
    if (!latitude || !longitude) return;

    const places = await searchNearby({
      latitude,
      longitude,
      radius: radius * 1000,
    });

    if (places.length > 0) {
      setResult(places[Math.floor(Math.random() * places.length)]);
    } else {
      setResult(null);
    }

    setRevealed(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < -100) {
          Animated.timing(pan, {
            toValue: { x: 0, y: -500 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            handleReveal();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleReset = () => {
    slideAnim.setValue(100);
    pan.setValue({ x: 0, y: 0 });
    setRevealed(false);
    setResult(null);
  };

  const togglePriceLevel = (key: string) => {
    setSelectedPriceLevels(prev => 
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surpreenda-me</Text>
        <View style={{ width: 24 }} />
      </View>

      {!revealed ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Raio de busca {radius} km</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={radius}
                onValueChange={setRadius}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Tipo de evento</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Faixa de preço</Text>
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
          </View>

          {/* Interactive Area */}
          <View style={styles.interactionArea}>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.plateContainer,
                { transform: [{ translateY: pan.y }] }
              ]}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <Text style={styles.plateEmoji}>🍝</Text>
              )}
            </Animated.View>
            <Text style={styles.instructionText}>
              Arraste o prato para cima e descubra seu restaurante!
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultContainer}>
          {result ? (
            <Animated.View style={[styles.resultCard, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.imagePlaceholder}>
                <Ionicons name="restaurant-outline" size={64} color={Colors.textLight} />
              </View>
              
              <Text style={styles.resultTitle}>{result.name}</Text>
              <View style={styles.resultDetailsRow}>
                <Text style={styles.resultRating}>⭐ {result.rating || 'N/A'}</Text>
                <Text style={styles.resultDot}>•</Text>
                <Text style={styles.resultDetailText}>{result.types?.[0] || 'Restaurante'}</Text>
                <Text style={styles.resultDot}>•</Text>
                <Text style={styles.resultDetailText}>{result.priceLevel || '$$'}</Text>
              </View>
              
              {result.distance && (
                <Text style={styles.resultDistance}>{result.distance} km de distância</Text>
              )}

              <View style={styles.resultActions}>
                <Button 
                  title="Ver detalhes" 
                  onPress={() => router.push(`/restaurant/${result.placeId}`)} 
                  variant="primary"
                  fullWidth
                  style={{ marginBottom: Spacing.md }}
                />
                <TouchableOpacity onPress={handleReset} style={styles.linkBtn}>
                  <Text style={styles.linkText}>Sortear outro</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.linkBtn}>
                  <Text style={styles.linkTextDislike}>Não gostei</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.center}>
              <Text style={styles.resultTitle}>Nenhum resultado.</Text>
              <Button title="Tentar novamente" onPress={handleReset} variant="outline" style={{ marginTop: Spacing.lg }} />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, 
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { ...Typography.h3, color: Colors.text },
  scrollContent: { padding: Spacing.lg, flexGrow: 1 },
  
  filtersContainer: { marginBottom: Spacing.xxl },
  filterSection: { marginBottom: Spacing.xl },
  filterTitle: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.sm },
  chip: { marginRight: Spacing.sm },
  
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between' },
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
  priceBtnSelected: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  priceBtnText: { ...Typography.body1, color: Colors.textSecondary, fontWeight: 'bold' },
  priceBtnTextSelected: { color: Colors.primaryDark },

  interactionArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  plateContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    elevation: 8,
    marginBottom: Spacing.xl,
    borderWidth: 4,
    borderColor: Colors.primaryLight,
  },
  plateEmoji: { fontSize: 80 },
  instructionText: { ...Typography.h4, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.xl },

  resultContainer: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  center: { alignItems: 'center' },
  resultCard: { 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.xl, 
    padding: Spacing.xl, 
    ...Shadows.lg,
    elevation: 10,
    alignItems: 'center' 
  },
  imagePlaceholder: { 
    width: '100%', 
    height: 180, 
    backgroundColor: Colors.lightGray, 
    borderRadius: BorderRadius.lg, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: Spacing.lg 
  },
  resultTitle: { ...Typography.h2, marginBottom: Spacing.sm, color: Colors.text, textAlign: 'center' },
  resultDetailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  resultRating: { ...Typography.body1, fontFamily: Typography.fontFamily.bold, color: Colors.text },
  resultDot: { marginHorizontal: Spacing.sm, color: Colors.textLight },
  resultDetailText: { ...Typography.body1, color: Colors.textSecondary },
  resultDistance: { ...Typography.body2, color: Colors.primary, marginBottom: Spacing.xl, fontFamily: Typography.fontFamily.medium },
  
  resultActions: { width: '100%', marginTop: Spacing.md },
  linkBtn: { paddingVertical: Spacing.md, alignItems: 'center' },
  linkText: { ...Typography.body1, color: Colors.primary, fontFamily: Typography.fontFamily.semiBold },
  linkTextDislike: { ...Typography.body2, color: Colors.textLight, textDecorationLine: 'underline' },
});
