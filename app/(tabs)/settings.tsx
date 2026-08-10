import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';

const SettingsRow = ({ icon, title, value, onPress, isDestructive }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color={isDestructive ? Colors.error : Colors.primary} />
      <Text style={[styles.rowTitle, isDestructive && { color: Colors.error }]}>{title}</Text>
    </View>
    <View style={styles.rowRight}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile } = useUserStore();
  const { logout } = useAuthStore();

  const handleExportData = () => {
    // Export functionality
  };

  const handleDeleteAccount = () => {
    // Delete account functionality
  };

  const userName = profile?.displayName || 'Usuário';
  const initial = userName.charAt(0).toUpperCase();
  const language = profile?.language === 'en' ? 'English' : 'Português';
  const radius = profile?.defaultRadius ? `${profile.defaultRadius} km` : '5 km';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('settings.title', 'Configurações')}</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="pencil-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <TouchableOpacity>
              <Text style={styles.viewProfileText}>{t('settings.viewProfile', 'Ver perfil')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <SettingsRow icon="globe-outline" title={t('settings.language', 'Idioma')} value={language} onPress={() => {}} />
          <SettingsRow icon="location-outline" title={t('settings.radius', 'Raio máximo padrão')} value={radius} onPress={() => {}} />
          <SettingsRow icon="settings-outline" title={t('settings.preferences', 'Preferências padrão')} onPress={() => {}} />
          <SettingsRow icon="notifications-outline" title={t('settings.notifications', 'Notificações')} onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <SettingsRow 
            icon="lock-closed-outline" 
            title={t('settings.privacy', 'Privacidade e dados')} 
            onPress={() => router.push('/privacy-policy')} 
          />
          <SettingsRow icon="help-circle-outline" title={t('settings.help', 'Ajuda e suporte')} onPress={() => {}} />
        </View>

        <View style={styles.actionButtons}>
          <Button 
            title={t('settings.exportData', 'Exportar meus dados')} 
            variant="outline" 
            onPress={handleExportData}
            style={styles.actionBtn}
          />
          <Button 
            title={t('settings.deleteAccount', 'Excluir minha conta')} 
            variant="secondary"
            onPress={handleDeleteAccount}
            style={[styles.actionBtn, { backgroundColor: Colors.lightRed, borderColor: Colors.error }]}
          />
          <Button 
            title={t('settings.logout', 'Sair')} 
            variant="ghost" 
            onPress={logout}
            style={styles.actionBtn}
          />
        </View>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    ...Typography.h2,
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 4,
  },
  viewProfileText: {
    ...Typography.body2,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.medium,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    ...Typography.body,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  actionButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionBtn: {
    marginBottom: Spacing.sm,
  }
});
