import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { User } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

// ─── 1. MINIMALIST INLINE SVG FORK ICON ───
const MinimalistForkIcon = ({ color = '#FFFFFF', size = 36 }) => (
  <Svg width={size} height={size * 1.15} viewBox="0 0 32 38" fill="none">
    {/* 3 Tines */}
    <Path d="M8 3V13M16 3V13M24 3V13" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    {/* Curved Head */}
    <Path d="M8 13C8 17.4183 11.5817 21 16 21C20.4183 21 24 17.4183 24 13" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    {/* Handle */}
    <Path d="M16 21V35" stroke={color} strokeWidth="3.8" strokeLinecap="round" />
  </Svg>
);

// ─── 2. ORGANIC WAVE TRANSITION SVG ───
const OrganicWaveTransition = ({ width: waveWidth, height: waveHeight = 90 }: { width: number; height?: number }) => (
  <Svg width={waveWidth} height={waveHeight} viewBox={`0 0 ${waveWidth} ${waveHeight}`} style={styles.waveSvg}>
    <Path
      d={`M 0,15 C ${waveWidth * 0.3},85 ${waveWidth * 0.7},-25 ${waveWidth},45 L ${waveWidth},${waveHeight} L 0,${waveHeight} Z`}
      fill="#FAFAFA"
    />
  </Svg>
);

// ─── 3. ABSTRACT GEOMETRIC ARTWORK (CONCENTRIC PASTEL CIRCLES & GEAR/PLATE LINES) ───
const AbstractCulinaryArt = ({ size = 260 }: { size?: number }) => {
  const center = size / 2;
  return (
    <View style={[styles.abstractArtContainer, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {/* Outer Soft Pastel Circle (Beige / Warm Gray) */}
          <Circle cx={center} cy={center} r={size * 0.48} fill="#F4F1EA" />
          
          {/* Overlapping Pastel Yellow-Orange Accent Circle */}
          <Circle cx={center - size * 0.1} cy={center + size * 0.05} r={size * 0.38} fill="#FFF9EB" opacity={0.9} />
          
          {/* Middle Pastel Circle */}
          <Circle cx={center} cy={center} r={size * 0.34} fill="#EBE6DC" />
          
          {/* Minimalist Thin Outer Plate Rim */}
          <Circle cx={center} cy={center} r={size * 0.44} stroke="#D4CFC5" strokeWidth="1.2" strokeDasharray="6,4" fill="none" />
          
          {/* Inner Plate Rim Circle */}
          <Circle cx={center} cy={center} r={size * 0.25} fill="#FBF9F5" stroke="#C8C2B5" strokeWidth="1.5" />
          
          {/* Center Focal Circle (Soft Cream) */}
          <Circle cx={center} cy={center} r={size * 0.14} fill="#E6DFD3" />
          
          {/* Conceptual Gear / Culinary Radial Ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => {
            const rad = (angle * Math.PI) / 180;
            const rInner = size * 0.28;
            const rOuter = size * 0.32;
            const x1 = center + rInner * Math.cos(rad);
            const y1 = center + rInner * Math.sin(rad);
            const x2 = center + rOuter * Math.cos(rad);
            const y2 = center + rOuter * Math.sin(rad);
            return (
              <Line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#B8B0A0"
                strokeWidth={index % 3 === 0 ? "2" : "1"}
                strokeLinecap="round"
                opacity={0.8}
              />
            );
          })}

          {/* Abstract Geometric Lines (Crossing Tangents) */}
          <Line x1={center - size * 0.35} y1={center - size * 0.2} x2={center + size * 0.35} y2={center + size * 0.2} stroke="#D6CFBF" strokeWidth="1" opacity={0.6} />
          <Line x1={center - size * 0.2} y1={center + size * 0.35} x2={center + size * 0.2} y2={center - size * 0.35} stroke="#D6CFBF" strokeWidth="1" opacity={0.6} />
        </G>
      </Svg>
    </View>
  );
};

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
        // ─── STEP 1: Abstract Geometric Hero Splash Screen ───
        <TouchableOpacity
          activeOpacity={0.96}
          onPress={() => setShowOptions(true)}
          style={styles.heroContainer}
        >
          {/* Top Solid Red Background */}
          <View style={styles.redHeaderArea}>
            <View style={styles.brandContent}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titleLet}>Let's</Text>
                <View style={styles.eatRow}>
                  <Text style={styles.titleEat}>Eat</Text>
                  <View style={styles.forkContainer}>
                    <MinimalistForkIcon color="#FFFFFF" size={38} />
                  </View>
                </View>
              </View>

              <Text style={styles.subtitleText}>Descubra. Avalie.</Text>
              <Text style={styles.subtitleText}>Viva experiências incríveis.</Text>
            </View>
          </View>

          {/* Organic Wave Line Transition (Code Generated SVG) */}
          <OrganicWaveTransition width={width} height={80} />

          {/* Bottom Pure White Area with Abstract Geometric Composition */}
          <View style={styles.whiteBottomArea}>
            <AbstractCulinaryArt size={Math.min(width * 0.68, height * 0.32)} />

            {/* Tap Prompt Hint */}
            <View style={styles.tapPrompt}>
              <Text style={styles.tapPromptText}>Toque para continuar</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        // ─── STEP 2: Login Options Screen ───
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
    backgroundColor: '#FAFAFA',
  },
  redHeaderArea: {
    backgroundColor: '#D32F2F',
    paddingTop: height * 0.08,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 60,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    lineHeight: 66,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  eatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleEat: {
    fontSize: 60,
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    lineHeight: 66,
    letterSpacing: -0.5,
  },
  forkContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 19,
    fontFamily: Typography.fontFamily.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.96,
  },

  // Wave SVG Style
  waveSvg: {
    backgroundColor: '#D32F2F',
  },

  // Bottom White Area & Abstract Art
  whiteBottomArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  abstractArtContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  tapPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  tapPromptText: {
    ...Typography.body2,
    color: Colors.primary,
    fontFamily: Typography.fontFamily.semiBold,
    marginRight: 6,
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
