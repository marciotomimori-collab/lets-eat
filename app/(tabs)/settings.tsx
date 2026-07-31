import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuthStore();

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
        <View style={styles.avatar}><Text style={styles.avatarText}>LE</Text></View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Usuário Teste</Text>
          <Text style={styles.profileEmail}>usuario@letseat.com</Text>
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontFamily: 'Inter-Bold', marginVertical: 24, marginHorizontal: 16, color: '#333', paddingTop: 40 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginBottom: 24, marginHorizontal: 16, borderRadius: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors?.primary || '#E53935', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontFamily: 'Inter-Bold' },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#666', fontFamily: 'Inter-Regular' },
  editBtn: { color: Colors?.primary || '#E53935', fontFamily: 'Inter-SemiBold' },
  sectionHeader: { fontSize: 13, fontFamily: 'Inter-Bold', color: '#888', textTransform: 'uppercase', marginHorizontal: 16, marginBottom: 8 },
  section: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginBottom: 24, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: 12 },
  rowTitle: { fontSize: 16, fontFamily: 'Inter-Regular' },
  version: { textAlign: 'center', color: '#999', marginBottom: 40, marginTop: 10, fontFamily: 'Inter-Regular' }
});
