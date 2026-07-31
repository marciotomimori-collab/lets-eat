import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function SearchResultsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mocking API call with useGooglePlaces logic
    setTimeout(() => {
      setLoading(false);
      // setResults([{ id: '1', name: 'Mock Restaurant', rating: 4.5 }]);
    }, 1500);
  }, [params]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{results.length} {t('search.resultsFound', 'resultados encontrados')}</Text>
      </View>
      
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList 
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.card}><Text>{item.name}</Text></View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>{t('search.noResults', 'Nenhum restaurante encontrado')}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
                <Text style={styles.retryText}>{t('common.retry', 'Tentar novamente')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, backgroundColor: '#fff', elevation: 2 },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 150 },
  emptyText: { marginTop: 16, color: '#666', fontSize: 16, marginBottom: 24, fontFamily: 'Inter-Regular' },
  retryBtn: { backgroundColor: Colors?.primary || '#E53935', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontFamily: 'Inter-Bold' },
  card: { padding: 16, backgroundColor: '#fff', margin: 16, borderRadius: 8 },
  errorText: { color: 'red', fontFamily: 'Inter-SemiBold' }
});
