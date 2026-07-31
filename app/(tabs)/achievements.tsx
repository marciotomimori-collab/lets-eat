import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
// Assuming useAchievements would be imported from a hook like this
// import { useAchievements } from '../../hooks/useAchievements';

export default function AchievementsScreen() {
  const { t } = useTranslation();
  
  const renderCard = (title, icon, status, progress = '') => {
    const isLocked = status === 'locked';
    const inProgress = status === 'progress';
    return (
      <View style={[styles.card, isLocked && styles.cardLocked]} key={title}>
        {isLocked ? (
          <Ionicons name="lock-closed" size={32} color="#999" />
        ) : (
          <Text style={styles.emoji}>{icon}</Text>
        )}
        {status === 'unlocked' && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
        )}
        {inProgress && <Text style={styles.progressText}>{progress}</Text>}
        <Text style={[styles.cardTitle, isLocked && styles.lockedText]} numberOfLines={2}>
          {isLocked ? '???' : title}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏆 {t('achievements.title', 'Conquistas')}</Text>
      
      <Text style={styles.sectionTitle}>{t('achievements.unlocked', 'Desbloqueadas')}</Text>
      <View style={styles.grid}>
        {renderCard('Primeira Mordida', '🍔', 'unlocked')}
        {renderCard('Crítico Feroz', '✍️', 'unlocked')}
      </View>

      <Text style={styles.sectionTitle}>{t('achievements.inProgress', 'Em progresso')}</Text>
      <View style={styles.grid}>
        {renderCard('Explorador', '🗺️', 'progress', '2/5')}
        {renderCard('Rei da Pizza', '🍕', 'progress', '1/3')}
      </View>

      <Text style={styles.sectionTitle}>{t('achievements.locked', 'Bloqueadas')}</Text>
      <View style={styles.grid}>
        {renderCard('lock1', '', 'locked')}
        {renderCard('lock2', '', 'locked')}
        {renderCard('lock3', '', 'locked')}
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 28, fontFamily: 'Inter-Bold', marginBottom: 24, color: '#333' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#555', marginBottom: 12, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '31%', aspectRatio: 0.85, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  cardLocked: { backgroundColor: '#eee', opacity: 0.6 },
  emoji: { fontSize: 32, marginBottom: 8 },
  checkIcon: { position: 'absolute', top: 4, right: 4, backgroundColor: '#fff', borderRadius: 12 },
  cardTitle: { fontSize: 12, textAlign: 'center', fontFamily: 'Inter-SemiBold', marginTop: 4, color: '#333' },
  lockedText: { color: '#999' },
  progressText: { fontSize: 12, color: Colors?.primary || '#E53935', fontFamily: 'Inter-Bold', marginTop: 4 }
});
