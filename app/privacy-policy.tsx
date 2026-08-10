import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const PrivacyRow = ({ icon, title, onPress, isDestructive }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowTitle, isDestructive && { color: Colors.error }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
  </TouchableOpacity>
);

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy.title', 'Privacidade e dados')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <PrivacyRow 
            icon="📄" 
            title={t('privacy.policy', 'Política de Privacidade')} 
            onPress={() => {}} 
          />
          <PrivacyRow 
            icon="📋" 
            title={t('privacy.terms', 'Termos de Uso')} 
            onPress={() => {}} 
          />
          <PrivacyRow 
            icon="⚖️" 
            title={t('privacy.lgpd', 'LGPD e seus direitos')} 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.section}>
          <PrivacyRow 
            icon="📤" 
            title={t('privacy.export', 'Exportar meus dados')} 
            onPress={() => {}} 
          />
          <PrivacyRow 
            icon="🗑️" 
            title={t('privacy.delete', 'Apagar meus dados')} 
            isDestructive
            onPress={() => {}} 
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerIconContainer}>
            <Ionicons name="lock-closed" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.footerTitle}>{t('privacy.secureTitle', 'Seus dados estão seguros')}</Text>
          <Text style={styles.footerText}>
            {t('privacy.secureText', 'Utilizamos criptografia e seguimos as melhores práticas para proteger suas informações.')}
          </Text>
          <TouchableOpacity>
            <Text style={styles.learnMore}>{t('privacy.learnMore', 'Saiba mais')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
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
  rowIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  rowTitle: {
    ...Typography.body,
    color: Colors.text,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    padding: Spacing.xl,
    backgroundColor: Colors.primaryGhost,
    borderRadius: BorderRadius.lg,
  },
  footerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  footerTitle: {
    ...Typography.h4,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  footerText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  learnMore: {
    ...Typography.body,
    color: Colors.info,
    fontFamily: Typography.fontFamily.medium,
  }
});
