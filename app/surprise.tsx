import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function SurpriseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];

  const handleReveal = () => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('surprise.title', 'Surpreenda-me!')}</Text>
      
      <View style={styles.filters}>
        <Text style={styles.badge}>⭐ {t('surprise.badge', 'Apenas restaurantes 4.5+')}</Text>
      </View>
      
      <View style={styles.center}>
        {!revealed ? (
          <TouchableOpacity style={styles.surpriseBtn} onPress={handleReveal} activeOpacity={0.8}>
            <Ionicons name="restaurant" size={64} color="#fff" />
            <Text style={styles.surpriseText}>{t('surprise.button', 'Revelar')}</Text>
          </TouchableOpacity>
        ) : (
          <Animated.View style={[styles.resultCard, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={48} color="#ccc" />
            </View>
            <Text style={styles.resultTitle}>O Bistrô Perfeito</Text>
            <Text style={styles.resultDetails}>⭐ 4.8 | 💲💲 • Francesa</Text>
            
            <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/restaurant/123')}>
              <Text style={styles.goBtnText}>{t('surprise.viewDetails', 'Ver Detalhes')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dislikeBtn} onPress={handleReset}>
              <Text style={styles.dislikeText}>{t('surprise.dislike', 'Não curtiu? Tentar outro')}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 80, paddingHorizontal: 16 },
  header: { fontSize: 32, fontFamily: 'Inter-Bold', textAlign: 'center', color: Colors?.primary || '#E53935', marginBottom: 24 },
  filters: { alignItems: 'center', marginBottom: 60 },
  badge: { backgroundColor: '#FFF9C4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, fontFamily: 'Inter-Bold', color: '#F57F17' },
  center: { flex: 1, alignItems: 'center', paddingTop: 20 },
  surpriseBtn: { width: 220, height: 220, borderRadius: 110, backgroundColor: Colors?.primary || '#E53935', justifyContent: 'center', alignItems: 'center', elevation: 12, shadowColor: '#E53935', shadowOpacity: 0.5, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  surpriseText: { color: '#fff', fontSize: 22, fontFamily: 'Inter-Bold', marginTop: 12 },
  resultCard: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: 160, backgroundColor: '#f0f0f0', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 24, fontFamily: 'Inter-Bold', marginBottom: 8, color: '#333', textAlign: 'center' },
  resultDetails: { fontSize: 16, color: '#666', fontFamily: 'Inter-SemiBold', marginBottom: 24 },
  goBtn: { width: '100%', backgroundColor: Colors?.primary || '#E53935', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  goBtnText: { color: '#fff', fontFamily: 'Inter-Bold', fontSize: 18 },
  dislikeBtn: { marginTop: 24, padding: 8 },
  dislikeText: { color: '#999', textDecorationLine: 'underline', fontFamily: 'Inter-Regular', fontSize: 16 }
});
