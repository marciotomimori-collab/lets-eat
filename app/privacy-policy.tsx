import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy.title', 'Política de Privacidade')}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{t('privacy.dataCollectionTitle', 'Coleta de Dados')}</Text>
        <Text style={styles.paragraph}>
          {t('privacy.dataCollectionText', 'Coletamos informações básicas de perfil, preferências alimentares e dados de localização para fornecer recomendações precisas e personalizadas.')}
        </Text>

        <Text style={styles.sectionTitle}>{t('privacy.dataUsageTitle', 'Uso dos Dados')}</Text>
        <Text style={styles.paragraph}>
          {t('privacy.dataUsageText', 'Os dados são utilizados exclusivamente para melhorar a experiência no app, gerar histórico de conquistas e conectar você a restaurantes incríveis.')}
        </Text>

        <Text style={styles.sectionTitle}>{t('privacy.thirdPartiesTitle', 'Serviços de Terceiros')}</Text>
        <Text style={styles.paragraph}>
          {t('privacy.thirdPartiesText', 'Utilizamos serviços do Google Places API e Firebase. Seus dados são processados e armazenados de forma segura conforme as políticas globais destas plataformas.')}
        </Text>

        <Text style={styles.sectionTitle}>{t('privacy.userRightsTitle', 'Seus Direitos')}</Text>
        <Text style={styles.paragraph}>
          {t('privacy.userRightsText', 'Você pode solicitar a exportação ou exclusão permanente de todos os seus dados a qualquer momento nas configurações do aplicativo.')}
        </Text>

        <View style={{height: 60}}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#333' },
  content: { padding: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: Colors?.primary || '#E53935', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 15, color: '#444', lineHeight: 24, fontFamily: 'Inter-Regular' }
});
