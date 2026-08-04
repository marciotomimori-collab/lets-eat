import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { createReview } from '../../services/firebase/firestore';
import { useAuthStore } from '../../stores/authStore';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (rating === 0 || !user?.uid) return;
    setSubmitting(true);
    try {
      await createReview(user.uid, user.email?.split('@')[0] || 'User', {
        placeId: id as string,
        rating,
        comment,
      });
      router.back();
    } catch(e) {
      console.error(e);
      setSubmitting(false);
    }
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
          style={[styles.submitBtn, (rating === 0 || submitting) && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={rating === 0 || submitting}
        >
          <Text style={styles.submitBtnText}>{submitting ? 'Enviando...' : t('common.submit', 'Enviar Avaliação')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  headerTitle: { ...Typography.h3, color: Colors.text },
  content: { padding: Spacing.xxl, alignItems: 'center' },
  restaurantName: { ...Typography.h2, color: Colors.text, marginBottom: Spacing.xxxl },
  starsContainer: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  ratingHint: { color: Colors.textSecondary, marginBottom: Spacing.section, ...Typography.body1 },
  input: { width: '100%', backgroundColor: Colors.lightGray, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.lg, padding: Spacing.xl, ...Typography.body1, minHeight: 160, marginBottom: Spacing.section },
  submitBtn: { width: '100%', backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: BorderRadius.lg, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: { color: Colors.surface, fontFamily: Typography.fontFamily.bold, ...Typography.body1 }
});
