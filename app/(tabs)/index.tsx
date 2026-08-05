import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
import { RestaurantCard } from '../../components/home/RestaurantCard';
import { RestaurantCardData } from '../../types/restaurant';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const userName = profile?.displayName || user?.email?.split('@')[0] || 'Visitante';
  const recentVisits: RestaurantCardData[] = []; // Empty state for now

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleEatPress = () => {
    setModalVisible(true);
  };

  const navigateToSearch = () => {
    setModalVisible(false);
    router.push('/search-results');
  };

  const navigateToSurprise = () => {
    setModalVisible(false);
    router.push('/surprise'); // Or appropriate route
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {t('home.greeting', { name: userName, defaultValue: `Olá, ${userName}! 👋` })}
          </Text>
          <Text style={styles.subheading}>
            {t('home.subheading', 'O que vamos comer hoje?')}
          </Text>
        </View>

        {/* Main Action Button */}
        <View style={styles.mainActionContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleEatPress}
          >
            <Animated.View style={[styles.mainButton, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.mainButtonEmoji}>🍔</Text>
              <Text style={styles.mainButtonText}>Vamos Comer?</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Recent Visits */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>{t('home.recentVisits', 'Últimas visitas')}</Text>
          {recentVisits.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {recentVisits.map((visit) => (
                <View style={styles.cardWrapper} key={visit.placeId}>
                  <RestaurantCard
                    data={visit}
                    onPress={(id) => router.push(`/restaurant/${id}`)}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t('home.noRecentVisits', 'Nenhuma visita recente ainda.')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Como você quer escolher?</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={navigateToSearch}>
              <Text style={styles.modalOptionIcon}>🔍</Text>
              <Text style={styles.modalOptionText}>Eu sei o que quero</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={navigateToSurprise}>
              <Text style={styles.modalOptionIcon}>🎲</Text>
              <Text style={styles.modalOptionText}>Quero ser surpreendido!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    backgroundColor: Colors.background, 
  },
  greeting: {
    ...Typography.h2,
    color: Colors.text,
  },
  subheading: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  mainActionContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  mainButton: {
    backgroundColor: Colors.primary,
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  mainButtonEmoji: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  mainButtonText: {
    ...Typography.h3,
    color: '#fff',
    fontWeight: 'bold',
  },
  recentSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  cardWrapper: {
    width: 280,
    marginRight: Spacing.md,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
  },
  emptyStateText: {
    ...Typography.body1,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  modalOptionText: {
    ...Typography.h4,
    color: Colors.text,
  },
});
