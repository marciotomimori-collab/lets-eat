import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../../constants/colors';
import { Spacing, Typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { signInAnonymously } from '../../services/firebase/auth';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailPress = () => {
    router.push('/(auth)/register');
  };

  const handleGooglePress = () => {
    // Simplified google sign in
    console.log('Google Sign In');
  };

  const handleGuestPress = async () => {
    try {
      setIsLoading(true);
      await signInAnonymously();
      router.replace('/(auth)/onboarding');
    } catch (error) {
      console.error('Guest login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary + '80', Colors.primary]} // Light red to primary gradient
        style={styles.topArea}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.emoji}>🍽️</Text>
          <Text style={styles.title}>LET'S EAT</Text>
          <Text style={styles.tagline}>{t('welcome.tagline', 'Descubra onde comer hoje')}</Text>
        </View>
      </LinearGradient>

      <View style={styles.bottomArea}>
        <Button
          title={t('welcome.emailButton', 'Criar conta com e-mail')}
          onPress={handleEmailPress}
          variant="primary"
          style={styles.button}
        />
        
        <Button
          title={t('welcome.googleButton', 'Continuar com Google')}
          onPress={handleGooglePress}
          variant="outline"
          style={styles.button}
        />

        <Button
          title={t('welcome.guestButton', 'Entrar como convidado')}
          onPress={handleGuestPress}
          variant="ghost"
          style={styles.button}
          loading={isLoading}
        />

        <Text style={styles.footerText}>
          {t('welcome.terms', 'Ao continuar, você concorda com nossa ')}
          <Text style={styles.link}>{t('welcome.privacyPolicy', 'Política de Privacidade')}</Text>
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
  topArea: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.h1,
    color: Colors.surface,
    marginBottom: Spacing.s,
    fontWeight: 'bold',
  },
  tagline: {
    ...Typography.body,
    color: Colors.surface,
    opacity: 0.9,
  },
  bottomArea: {
    flex: 0.5,
    padding: Spacing.l,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  button: {
    marginBottom: Spacing.m,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
