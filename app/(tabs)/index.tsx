import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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
    router.push('/search-form' as any);
  };

  const navigateToSurprise = () => {
    setModalVisible(false);
    router.push('/surprise' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá, {userName}! 👋
          </Text>
          <Text style={styles.subheading}>
            Pronto para descobrir novos sabores?
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
              <Text style={styles.mainButtonText}>Vamos comer?</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Como você quer escolher hoje?</Text>
            
            <TouchableOpacity style={styles.modalCard} onPress={navigateToSearch}>
              <View style={styles.modalCardLeft}>
                <View style={styles.letterCircle}>
                  <Text style={styles.letterText}>A</Text>
                </View>
                <Text style={styles.modalCardIcon}>🔍</Text>
              </View>
              <View style={styles.modalCardBody}>
                <Text style={styles.modalCardTitle}>Formulário rápido</Text>
                <Text style={styles.modalCardSubtitle}>Encontre o lugar ideal</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCard} onPress={navigateToSurprise}>
              <View style={styles.modalCardLeft}>
                <View style={styles.letterCircle}>
                  <Text style={styles.letterText}>B</Text>
                </View>
                <Text style={styles.modalCardIcon}>🎲</Text>
              </View>
              <View style={styles.modalCardBody}>
                <Text style={styles.modalCardTitle}>Quero ser surpreendido</Text>
                <Text style={styles.modalCardSubtitle}>Deixe a sorte escolher!</Text>
              </View>
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
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xxl,
  },
  mainButton: {
    backgroundColor: Colors.primary,
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    elevation: 12,
  },
  mainButtonText: {
    ...Typography.h2,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  modalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  modalCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  letterText: {
    color: Colors.primaryDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCardIcon: {
    fontSize: 28,
  },
  modalCardBody: {
    flex: 1,
  },
  modalCardTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 2,
  },
  modalCardSubtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
});
