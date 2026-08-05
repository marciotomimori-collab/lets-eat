import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAchievements } from '../../hooks/useAchievements';

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const { achievements, isLoaded } = useAchievements();
  
  const renderCard = (key: string, title: string, icon: string, status: 'locked' | 'unlocked' | 'progress', progressText: string = '') => {
    const isLocked = status === 'locked';
    const inProgress = status === 'progress';
    return (
      <View style={[styles.card, isLocked && styles.cardLocked]} key={key}>
        {isLocked ? (
          <Ionicons name="lock-closed" size={32} color="#999" />
        ) : (
          <Text style={styles.emoji}>{icon}</Text>
        )}
        {status === 'unlocked' && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
        )}
        {inProgress && <Text style={styles.progressText}>{progressText}</Text>}
        <Text style={[styles.cardTitle, isLocked && styles.lockedText]} numberOfLines={2}>
          {isLocked ? '???' : title}
        </Text>
      </View>
    );
  };

  const unlocked = achievements?.filter(a => a.isUnlocked) || [];
  const inProgress = achievements?.filter(a => !a.isUnlocked && a.progress > 0) || [];
  const locked = achievements?.filter(a => !a.isUnlocked && a.progress === 0) || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏆 {t('achievements.title', 'Conquistas')}</Text>
      
      {unlocked.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t('achievements.unlocked', 'Desbloqueadas')}</Text>
          <View style={styles.grid}>
            {unlocked.map((ach) => renderCard(ach.key, ach.title, ach.emoji, 'unlocked'))}
          </View>
        </>
      )}

      {inProgress.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t('achievements.inProgress', 'Em progresso')}</Text>
          <View style={styles.grid}>
            {inProgress.map((ach) => renderCard(ach.key, ach.title, ach.emoji, 'progress', `${ach.progress}/${ach.target}`))}
          </View>
        </>
      )}

      {locked.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{t('achievements.locked', 'Bloqueadas')}</Text>
          <View style={styles.grid}>
            {locked.map((ach) => renderCard(ach.key, ach.title, ach.emoji, 'locked'))}
          </View>
        </>
      )}

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60, paddingHorizontal: Spacing.lg },
  header: { ...Typography.h1, marginBottom: Spacing.xxl, color: Colors.text },
  sectionTitle: { ...Typography.h3, color: Colors.textSecondary, marginBottom: Spacing.md, marginTop: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  card: { width: '31%', aspectRatio: 0.85, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.sm, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  cardLocked: { backgroundColor: Colors.lightGray, opacity: 0.6 },
  emoji: { fontSize: 32, marginBottom: Spacing.sm },
  checkIcon: { position: 'absolute', top: 4, right: 4, backgroundColor: Colors.surface, borderRadius: BorderRadius.md },
  cardTitle: { ...Typography.caption, textAlign: 'center', fontFamily: Typography.fontFamily.semiBold, marginTop: 4, color: Colors.text },
  lockedText: { color: Colors.textSecondary },
  progressText: { ...Typography.caption, color: Colors.primary, fontFamily: Typography.fontFamily.bold, marginTop: 4 }
});
