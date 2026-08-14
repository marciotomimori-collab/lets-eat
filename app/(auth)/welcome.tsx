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

// ─── Minimalist Fork SVG Icon ───
const ForkIcon = ({ color = '#FFFFFF', size = 34 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size * 1.15} viewBox="0 0 32 38" fill="none">
    <Path d="M8 3V13M16 3V13M24 3V13" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    <Path d="M8 13C8 17.4183 11.5817 21 16 21C20.4183 21 24 17.4183 24 13" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
    <Path d="M16 21V35" stroke={color} strokeWidth="3.8" strokeLinecap="round" />
  </Svg>
);

// ─── Organic Wave SVG ───
const WaveSvg = ({ w, h = 80 }: { w: number; h?: number }) => (
  <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ backgroundColor: Colors.primary }}>
    <Path
      d={`M 0,18 C ${w * 0.3},75 ${w * 0.7},-20 ${w},42 L ${w},${h} L 0,${h} Z`}
      fill={Colors.background}
    />
  </Svg>
);

// ─── Abstract Geometric Plate Composition ───
const PlateArt = ({ size = 240 }: { size?: number }) => {
  const c = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={c} cy={c} r={size * 0.47} fill="#EDEDED" />
      <Circle cx={c} cy={c} r={size * 0.35} fill="#F5F5F5" />
      <Circle cx={c} cy={c} r={size * 0.43} stroke="#DCDCDC" strokeWidth="1.2" strokeDasharray="6,4" fill="none" />
      <Circle cx={c} cy={c} r={size * 0.24} fill="#FAFAFA" stroke="#D4D4D4" strokeWidth="1.5" />
      <Circle cx={c} cy={c} r={size * 0.13} fill="#E8E8E8" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = size * 0.27, r2 = size * 0.31;
        return (
          <Line key={i} x1={c + r1 * Math.cos(rad)} y1={c + r1 * Math.sin(rad)} x2={c + r2 * Math.cos(rad)} y2={c + r2 * Math.sin(rad)} stroke="#BFBFBF" strokeWidth={i % 3 === 0 ? '2' : '1'} strokeLinecap="round" opacity={0.7} />
        );
      })}
    </Svg>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showOptions, setShowOptions] = useState(false);

  const handleGuestLogin = () => {
    setUser({
      uid: 'guest-user-123',
      isAnonymous: true,
      email: null,
      displayName: null,
    } as unknown as User);
    router.replace('/(auth)/onboarding');
  };

  const handleGoogleLogin = () => {
    setUser({
      uid: 'google-user-123',
      isAnonymous: false,
      email: 'user@google.com',
      displayName: 'Google User',
    } as unknown as User);
    router.replace('/(auth)/onboarding');
  };

  if (showOptions) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: Colors.background }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.optionsView}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setShowOptions(false)}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.optionsHeaderBlock}>
            <Text style={styles.optionsHeading}>Como você deseja</Text>
            <Text style={styles.optionsHeadingRed}>continuar?</Text>
          </View>

          <View style={styles.optionsBtns}>
            <Button title="Criar uma conta com e-mail" onPress={() => router.push('/(auth)/register')} variant="primary" fullWidth icon="mail" />
            <View style={{ height: Spacing.md }} />
            <Button title="Conectar com Google" onPress={handleGoogleLogin} variant="outline" fullWidth icon="logo-google" />
            <View style={{ height: Spacing.md }} />
            <Button title="Entrar como convidado" onPress={handleGuestLogin} variant="ghost" fullWidth icon="person-outline" />
          </View>

          <Text style={styles.termsText}>
            Ao continuar, você concorda com os{' '}
            <Link href="/privacy-policy" asChild>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Termos de Uso e Política de Privacidade</Text>
              </TouchableOpacity>
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <TouchableOpacity activeOpacity={0.96} onPress={() => setShowOptions(true)} style={styles.hero}>
        {/* Red Header */}
        <View style={styles.redArea}>
          <View style={styles.brand}>
            <Text style={styles.logoLets}>Let's</Text>
            <View style={styles.logoRow}>
              <Text style={styles.logoEat}>Eat</Text>
              <View style={{ marginLeft: 8 }}>
                <ForkIcon color="#FFFFFF" size={36} />
              </View>
            </View>
          </View>
          <Text style={styles.tagline}>Descubra. Avalie.</Text>
          <Text style={styles.tagline}>Viva experiências incríveis.</Text>
        </View>

        {/* Wave Transition */}
        <WaveSvg w={width} h={80} />

        {/* White Bottom with Abstract Art */}
        <View style={styles.whiteArea}>
          <PlateArt size={Math.min(width * 0.65, 260)} />
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Toque para continuar</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  hero: { flex: 1, backgroundColor: Colors.background },
  redArea: {
    backgroundColor: Colors.primary,
    paddingTop: height * 0.07,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  brand: { alignItems: 'center', marginBottom: Spacing.lg },
  logoLets: { fontSize: 56, fontFamily: Typography.fontFamily.bold, color: '#FFF', lineHeight: 62 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoEat: { fontSize: 56, fontFamily: Typography.fontFamily.bold, color: '#FFF', lineHeight: 62 },
  tagline: { fontSize: 18, fontFamily: Typography.fontFamily.medium, color: '#FFF', textAlign: 'center', opacity: 0.95 },
  whiteArea: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.xl },
  tapHint: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4,
    borderWidth: 1, borderColor: '#E8E8E8',
  },
  tapHintText: { ...Typography.body2, color: Colors.primary, fontFamily: Typography.fontFamily.semiBold, marginRight: 6 },

  // Options View
  optionsView: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md },
  optionsHeaderBlock: { marginTop: Spacing.xl },
  optionsHeading: { fontSize: 28, fontFamily: Typography.fontFamily.bold, color: Colors.text },
  optionsHeadingRed: { fontSize: 28, fontFamily: Typography.fontFamily.bold, color: Colors.primary },
  optionsBtns: { flex: 1, justifyContent: 'center' },
  termsText: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.md },
  termsLink: { ...Typography.caption, color: Colors.primary, fontFamily: Typography.fontFamily.semiBold },
});
