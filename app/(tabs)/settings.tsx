import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { profile } = useUserStore();

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutTitle', 'Sair'),
      t('settings.logoutConfirm', 'Tem certeza que deseja sair?'),
      [
        { text: t('common.cancel', 'Cancelar'), style: 'cancel' },
        { text: t('common.yes', 'Sim'), onPress: () => {
          logout?.();
          router.replace('/(auth)/welcome');
        }, style: 'destructive' }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.deleteTitle', 'Excluir Conta'),
      t('settings.deleteConfirm', 'Esta ação é irreversível. Deseja continuar?'),
      [
        { text: t('common.cancel', 'Cancelar'), style: 'cancel' },
        { text: t('common.delete', 'Excluir'), onPress: () => console.log('Delete acc'), style: 'destructive' }
      ]
    );
  };

  const SectionRow = ({ icon, title, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.rowIcon} />
        <Text style={[styles.rowTitle, { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('settings.title', 'Configurações')}</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{profile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</Text></View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.name || 'Usuário Teste'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'usuario@letseat.com'}</Text>
        </View>
        <TouchableOpacity><Text style={styles.editBtn}>{t('settings.edit', 'Editar')}</Text></TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>{t('settings.preferences', 'Preferências')}</Text>
      <View style={styles.section}>
        <SectionRow icon="language" title={t('settings.language', 'Idioma')} />
        <SectionRow icon="location" title={t('settings.radius', 'Raio Padrão')} />
        <SectionRow icon="restaurant" title={t('settings.cuisines', 'Cozinhas Favoritas')} />
        <SectionRow icon="cash" title={t('settings.price', 'Preço Padrão')} />
      </View>

      <Text style={styles.sectionHeader}>{t('settings.privacy', 'Privacidade')}</Text>
      <View style={styles.section}>
        <SectionRow icon="shield-checkmark" title={t('settings.privacyPolicy', 'Política de Privacidade')} onPress={() => router.push('/privacy-policy')} />
        <SectionRow icon="download" title={t('settings.exportData', 'Exportar Dados')} />
        <SectionRow icon="trash" title={t('settings.deleteAccount', 'Excluir Conta')} onPress={handleDeleteAccount} color="#E53935" />
      </View>

      <Text style={styles.sectionHeader}>{t('settings.account', 'Conta')}</Text>
      <View style={styles.section}>
        <SectionRow icon="link" title={t('settings.linkGoogle', 'Vincular Google')} />
        <SectionRow icon="log-out" title={t('settings.logout', 'Sair')} onPress={handleLogout} color="#E53935" />
      </View>

      <Text style={styles.version}>Let's Eat v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { ...Typography.h1, marginVertical: Spacing.xxl, marginHorizontal: Spacing.lg, color: Colors.text, paddingTop: Spacing.xxl },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.lg, marginBottom: Spacing.xxl, marginHorizontal: Spacing.lg, borderRadius: BorderRadius.md },
  avatar: { width: 50, height: 50, borderRadius: BorderRadius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.surface, ...Typography.h3 },
  profileInfo: { flex: 1, marginLeft: Spacing.md },
  profileName: { ...Typography.h3, color: Colors.text },
  profileEmail: { ...Typography.body2, color: Colors.textSecondary },
  editBtn: { color: Colors.primary, ...Typography.body1, fontFamily: Typography.fontFamily.semiBold },
  sectionHeader: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase', marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  section: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, marginHorizontal: Spacing.lg, marginBottom: Spacing.xxl, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: Spacing.md },
  rowTitle: { ...Typography.body1 },
  version: { textAlign: 'center', color: Colors.textSecondary, marginBottom: Spacing.section, marginTop: Spacing.sm, ...Typography.body2 }
});
