import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { User } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showOptions, setShowOptions] = useState(false);

  const handleGuestLogin = () => {
    const mockGuestUser = {
      uid: 'guest-user-123',
      isAnonymous: true,
      email: null,
      displayName: null,
    } as unknown as User;

    setUser(mockGuestUser);
    router.replace('/(auth)/onboarding');
  };

  const handleGoogleLogin = () => {
    const mockGoogleUser = {
      uid: 'google-user-123',
      isAnonymous: false,
      email: 'user@google.com',
      displayName: 'Google User',
    } as unknown as User;

    setUser(mockGoogleUser);
    router.replace('/(auth)/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {!showOptions ? (
        // ─── STEP 1: Hero Splash View (Exact Match to Image) ───
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => setShowOptions(true)}
          style={styles.heroContainer}
        >
          {/* Background Red Container */}
          <View style={styles.redBackground}>
            {/* Watermark Food Icons (Decorative) */}
            <View style={styles.watermarkContainer} pointerEvents="none">
              <Text style={[styles.watermarkIcon, { top: '10%', left: '10%' }]}>🍕</Text>
              <Text style={[styles.watermarkIcon, { top: '15%', right: '12%' }]}>🍔</Text>
              <Text style={[styles.watermarkIcon, { top: '35%', left: '8%' }]}>🌮</Text>
              <Text style={[styles.watermarkIcon, { top: '40%', right: '10%' }]}>🍣</Text>
              <Text style={[styles.watermarkIcon, { top: '55%', left: '15%' }]}>🍩</Text>
            </View>

            {/* Main Brand Logo & Tagline */}
            <View style={styles.brandContent}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titleLet}>Let's</Text>
                <View style={styles.eatRow}>
                  <Text style={styles.titleEat}>Eat</Text>
                  <Text style={styles.titleFork}>🍴</Text>
                </View>
              </View>

              <Text style={styles.taglineLine1}>Descubra. Avalie.</Text>
              <Text style={styles.taglineLine2}>Viva experiências incríveis.</Text>
            </View>
          </View>

          {/* Bottom Curved Wave Container */}
          <View style={styles.bottomCurveContainer}>
            {/* Smooth White Wave */}
            <View style={styles.whiteCurveShape} />

            {/* Hero Pasta Dish Image */}
            <View style={styles.plateWrapper}>
              <Image
                source={require('../../assets/images/hero_pasta_dish.jpg')}
                style={styles.plateImage}
                resizeMode="cover"
              />
            </View>

            {/* Tap Hint */}
            <View style={styles.tapPrompt}>
              <Text style={styles.tapPromptText}>Toque para continuar</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        // ─── STEP 2: Login Options View ───
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowOptions(false)}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.optionsHeader}>
            <Text style={styles.optionsTitle}>Como você deseja</Text>
            <Text style={styles.optionsTitleRed}>continuar?</Text>
          </View>

          <View style={styles.buttonStack}>
            <Button
              title="Criar uma conta com e-mail"
              onPress={() => router.push('/(auth)/register')}
              variant="primary"
              fullWidth
              style={styles.optionBtn}
            />

            <Button
              title="Conectar com Google"
              onPress={handleGoogleLogin}
              variant="outline"
              icon="logo-google"
              fullWidth
              style={styles.optionBtn}
            />

            <Button
              title="Entrar como convidado sem cadastro"
              onPress={handleGuestLogin}
              variant="ghost"
              fullWidth
              style={styles.optionBtn}
            />
          </View>

          <Text style={styles.footerText}>
            Ao continuar, você concorda com os{' '}
            <Link href="/privacy-policy" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>
                  Termos de Uso e Política de Privacidade
                </Text>
              </TouchableOpacity>
            </Link>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },

  // ─── STEP 1: HERO SPLASH STYLES ───
  heroContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#D32F2F',
  },
  redBackground: {
    flex: 1,
    paddingTop: height * 0.08,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  watermarkContainer: {
    ...StyleSheet.absoluteFill,
    opacity: 0.12,
  },
  watermarkIcon: {
    position: 'absolute',
    fontSize: 48,
  },
  brandContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  titleLet: {
    fontSize: 58,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    lineHeight: 64,
    textAlign: 'center',
  },
  eatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleEat: {
    fontSize: 58,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    lineHeight: 64,
  },
  titleFork: {
    fontSize: 46,
    marginLeft: 6,
    lineHeight: 54,
  },
  taglineLine1: {
    fontSize: 20,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  taglineLine2: {
    fontSize: 20,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.95,
  },

  // Bottom Wave & Dish
  bottomCurveContainer: {
    height: height * 0.38,
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  whiteCurveShape: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.30,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: width * 0.5,
    borderTopRightRadius: width * 0.5,
    transform: [{ scaleX: 1.4 }],
  },
  plateWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: (width * 0.72) / 2,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  plateImage: {
    width: '100%',
    height: '100%',
  },
  tapPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tapPromptText: {
    ...Typography.body2,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
    marginRight: 4,
  },

  // ─── STEP 2: OPTIONS VIEW STYLES ───
  optionsContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  optionsHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  optionsTitle: {
    fontSize: 28,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  optionsTitleRed: {
    fontSize: 28,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  buttonStack: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  optionBtn: {
    marginBottom: Spacing.sm,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
