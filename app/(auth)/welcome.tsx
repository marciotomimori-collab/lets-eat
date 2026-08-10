import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { User } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setUser } = useAuthStore();

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
    // Mock google login
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
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.topHalf}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Let's Eat 🍴</Text>
          <Text style={styles.subtitle}>
            {t('welcome.subtitle', 'Descubra. Avalie. Viva experiências incríveis.')}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.bottomHalf}>
        <Text style={styles.heading}>
          {t('welcome.heading', 'Como você deseja continuar?')}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title={t('welcome.email_btn', 'Criar uma conta com e-mail')}
            onPress={() => router.push('/(auth)/register')}
            variant="primary"
            fullWidth
            style={styles.button}
          />
          
          <Button
            title={t('welcome.google_btn', 'Conectar com Google')}
            onPress={handleGoogleLogin}
            variant="outline"
            icon="logo-google"
            fullWidth
            style={styles.button}
          />

          <Button
            title={t('welcome.guest_btn', 'Entrar como convidado sem cadastro')}
            onPress={handleGuestLogin}
            variant="ghost"
            fullWidth
            style={styles.button}
          />
        </View>

        <Text style={styles.footerText}>
          {t('welcome.terms', 'Ao continuar, você concorda com os ')}
          <Link href="/privacy-policy" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>{t('welcome.terms_link', 'Termos de Uso e Política de Privacidade')}</Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHalf: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoText: {
    ...Typography.h1,
    color: Colors.white,
    fontSize: 42,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomHalf: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxl,
  },
  heading: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    marginBottom: Spacing.sm,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
  },
});
