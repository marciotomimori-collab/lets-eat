import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();

  const openMaps = () => Linking.openURL('https://maps.google.com/?q=restaurante');
  const callPhone = () => Linking.openURL('tel:+5511999999999');

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
          <Text style={styles.title}>La Bella Pasta</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>⭐ 4.7 Google</Text></View>
            <View style={[styles.badge, styles.badgeApp]}><Text style={[styles.badgeText, {color: '#fff'}]}>⭐ 4.5 Let's Eat</Text></View>
          </View>

          <Text style={styles.subtitle}>💲💲 • Italiana</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors?.primary || '#E53935'} />
            <Text style={styles.infoText}>Rua Exemplo, 123 - Centro</Text>
          </View>
          
          <TouchableOpacity style={styles.infoRow} onPress={callPhone}>
            <Ionicons name="call" size={20} color={Colors?.primary || '#E53935'} />
            <Text style={[styles.infoText, { color: Colors?.primary || '#E53935' }]}>+55 11 99999-9999</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors?.primary || '#E53935'} />
            <Text style={styles.infoText}>Aberto agora • Fecha às 23:00</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={openMaps}>
              <Ionicons name="map" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>{t('restaurant.map', 'Ver no mapa')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} onPress={callPhone}>
              <Ionicons name="call" size={20} color={Colors?.primary || '#E53935'} />
              <Text style={[styles.actionBtnText, {color: Colors?.primary || '#E53935'}]}>{t('restaurant.call', 'Ligar')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t('restaurant.communityReviews', 'Avaliações da Comunidade')}</Text>
          <Text style={styles.emptyReviews}>{t('restaurant.noReviews', 'Seja o primeiro a avaliar!')}</Text>
          <View style={{height: 100}} />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push(`/write-review/${id}`)}
      >
        <Ionicons name="pencil" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagePlaceholder: { width: '100%', height: 280, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 16, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 4 },
  content: { padding: 24, marginTop: -20, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontSize: 32, fontFamily: 'Inter-Bold', color: '#333', marginBottom: 12 },
  ratingRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  badge: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeApp: { backgroundColor: Colors?.primary || '#E53935' },
  badgeText: { fontFamily: 'Inter-SemiBold', color: '#333' },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 24, fontFamily: 'Inter-Regular' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { fontSize: 16, color: '#444', marginLeft: 12, fontFamily: 'Inter-Regular' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 24 },
  actionBtn: { flex: 1, backgroundColor: Colors?.primary || '#E53935', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors?.primary || '#E53935' },
  actionBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter-Bold', marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 24 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#333', marginBottom: 16 },
  emptyReviews: { color: '#999', fontStyle: 'italic', fontFamily: 'Inter-Regular' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: Colors?.primary || '#E53935', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#E53935', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
});
