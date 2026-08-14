import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useUserStore } from '../../stores/userStore';

const { width } = Dimensions.get('window');

// ─── Mock restaurant data for the roulette ───
const RESTAURANTS = [
  { name: 'Burger House', category: 'Hambúrguer', rating: 4.8 },
  { name: 'Pizzaria Bella', category: 'Pizzaria', rating: 4.5 },
  { name: 'Sushi Master', category: 'Japonesa', rating: 4.9 },
  { name: 'Taco Loco', category: 'Mexicana', rating: 4.3 },
  { name: 'Pastel do Zé', category: 'Pastelaria', rating: 4.6 },
  { name: 'Cantina Italiana', category: 'Italiana', rating: 4.7 },
];

// ─── Mock achievement badges ───
const BADGES = [
  { id: '1', title: 'Explorador', icon: 'compass', subtitle: 'Sorteou 5 vezes', unlocked: true },
  { id: '2', title: 'Crítico', icon: 'star', subtitle: 'Deixou 10 reviews', unlocked: true },
  { id: '3', title: 'Sem Fome', icon: 'fast-food', subtitle: 'Pediu 3 burgers', unlocked: false },
  { id: '4', title: 'Notívago', icon: 'moon', subtitle: 'Pedidos na madrugada', unlocked: false },
];

// ─── Mock reviews ───
const REVIEWS = [
  { id: '1', user: 'Matheus S.', comment: 'O algoritmo acertou em cheio! O hambúrguer estava incrível.', rating: 5 },
  { id: '2', user: 'Ana Clara', comment: 'Usei a roleta e descobri uma pizzaria maravilhosa perto de casa.', rating: 4 },
  { id: '3', user: 'Rafael L.', comment: 'Ótima experiência! Fui surpreendido com um restaurante japonês sensacional.', rating: 5 },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const [selectedRestaurant, setSelectedRestaurant] = useState('Para onde vamos hoje?');
  const [isSpinning, setIsSpinning] = useState(false);

  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedRestaurant('Sorteando...');

    rotationAnim.setValue(0);
    Animated.timing(rotationAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const randomIndex = Math.floor(Math.random() * RESTAURANTS.length);
      const selected = RESTAURANTS[randomIndex];
      setSelectedRestaurant(`${selected.name} · ${selected.category}`);
      setIsSpinning(false);
    });
  };

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1440deg'],
  });

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Ionicons
            key={i}
            name={i <= rating ? 'star' : 'star-outline'}
            size={14}
            color={i <= rating ? Colors.star : Colors.starEmpty}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Let's Eat</Text>
        <Ionicons name="restaurant" size={22} color={Colors.primary} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════ ROULETTE SECTION ═══════════ */}
        <Text style={styles.sectionTitle}>Está indeciso?</Text>

        <View style={styles.card}>
          {/* Spinning Dice Circle */}
          <Animated.View
            style={[
              styles.diceCircle,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <Image
              source={require('../../assets/images/dice_icon.jpg')}
              style={styles.diceImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Selected Restaurant Name */}
          <Text style={styles.selectedRestaurant}>{selectedRestaurant}</Text>

          {/* Spin Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={spinRoulette}
            disabled={isSpinning}
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? 'Girando...' : 'Sortear Restaurante'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════ ACHIEVEMENTS SECTION ═══════════ */}
        <Text style={styles.sectionTitle}>Suas Conquistas</Text>

        <FlatList
          data={BADGES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.badgesList}
          renderItem={({ item }) => (
            <View style={[styles.badgeCard, !item.unlocked && styles.badgeCardLocked]}>
              <View style={[styles.badgeIconCircle, !item.unlocked && styles.badgeIconLocked]}>
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={item.unlocked ? Colors.primary : Colors.textLight}
                />
              </View>
              <Text style={[styles.badgeTitle, !item.unlocked && styles.badgeTitleLocked]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.badgeSubtitle} numberOfLines={1}>
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        {/* ═══════════ REVIEWS SECTION ═══════════ */}
        <Text style={styles.sectionTitle}>Avaliações da Galera</Text>

        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              {/* User Avatar */}
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {review.user.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.reviewHeaderInfo}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                {renderStars(review.rating)}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── AppBar ───
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    gap: 8,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  appBarTitle: {
    fontSize: 22,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
    letterSpacing: -0.3,
  },

  // ─── Scroll ───
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },

  // ─── Section Titles ───
  sectionTitle: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  // ─── Card (White elevated container) ───
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  // ─── Dice / Roulette ───
  diceCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  diceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  selectedRestaurant: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  spinButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonDisabled: {
    opacity: 0.7,
  },
  spinButtonText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },

  // ─── Badges / Achievements ───
  badgesList: {
    paddingBottom: Spacing.sm,
  },
  badgeCard: {
    width: 130,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  badgeCardLocked: {
    opacity: 0.4,
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  badgeIconLocked: {
    backgroundColor: Colors.lightGray,
  },
  badgeTitle: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: Colors.textLight,
  },
  badgeSubtitle: {
    fontSize: 10,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // ─── Reviews ───
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userAvatarText: {
    fontSize: 15,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginLeft: 48,
  },
});
