import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAchievements } from '../../hooks/useAchievements';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const { achievements, isLoaded } = useAchievements();

  if (!isLoaded) return <LoadingSpinner fullScreen />;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('achievements.title', 'Conquistas')}</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="share-social-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>{t('achievements.progress', 'Seu progresso')}</Text>
          <Text style={styles.progressNumber}>{unlockedCount}/{totalCount}</Text>
          <Text style={styles.progressSubtitle}>{t('achievements.unlocked', 'conquistas desbloqueadas')}</Text>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('achievements.recent', 'Conquistas recentes')}</Text>

        <View style={styles.grid}>
          {achievements.map((item) => (
            <View key={item.key} style={[styles.card, !item.isUnlocked && styles.cardLocked]}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              
              {item.isUnlocked ? (
                <View style={styles.statusRow}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.statusUnlocked}>{t('achievements.completed', 'Completado')}</Text>
                </View>
              ) : (
                <View style={styles.statusRow}>
                  <Text style={styles.statusLocked}>
                    {item.progress}/{item.target}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>{t('achievements.viewAll', 'Ver todas')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    ...Typography.h1,
    color: Colors.text,
  },
  headerIcon: {
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  progressSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  progressLabel: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  progressNumber: {
    ...Typography.display,
    color: Colors.primary,
    marginVertical: Spacing.xs,
  },
  progressSubtitle: {
    ...Typography.body2,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.lightRed,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardLocked: {
    opacity: 0.6,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.label,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  statusUnlocked: {
    ...Typography.caption,
    color: Colors.success,
    fontFamily: Typography.fontFamily.medium,
  },
  statusLocked: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  viewAllBtn: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.md,
  },
  viewAllText: {
    ...Typography.body,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
