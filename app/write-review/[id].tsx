import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    // Call createReview logic here
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('writeReview.title', 'Escrever avaliação')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.restaurantName}>La Bella Pasta</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Ionicons name={rating >= star ? "star" : "star-outline"} size={48} color="#FFD700" />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingHint}>
          {rating === 0 ? t('writeReview.selectRating', 'Toque para avaliar') : `${rating} ${t('writeReview.stars', 'estrelas')}`}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t('writeReview.placeholder', 'Conte como foi sua experiência... (opcional)')}
          placeholderTextColor="#999"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity 
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitBtnText}>{t('common.submit', 'Enviar Avaliação')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#333' },
  content: { padding: 24, alignItems: 'center' },
  restaurantName: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#333', marginBottom: 32 },
  starsContainer: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  ratingHint: { color: '#666', marginBottom: 40, fontFamily: 'Inter-Regular', fontSize: 16 },
  input: { width: '100%', backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 20, fontSize: 16, fontFamily: 'Inter-Regular', minHeight: 160, marginBottom: 40 },
  submitBtn: { width: '100%', backgroundColor: Colors?.primary || '#E53935', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#ccc' },
  submitBtnText: { color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold' }
});
