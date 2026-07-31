import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
import { RestaurantCardData } from '../../types/restaurant';

interface Props {
  data: RestaurantCardData;
  onPress: (id: string) => void;
}

export const RestaurantCard: React.FC<Props> = ({ data, onPress }) => {
  const priceDisplay = '$'.repeat(data.priceLevel || 1);
  const distanceDisplay = data.distance ? `${data.distance.toFixed(1)} km` : '';

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => onPress(data.id)}
    >
      <View style={styles.imageContainer}>
        {data.photoUrl ? (
          <Image source={{ uri: data.photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🍽️</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>
        <Text style={styles.ratingRow}>
          ⭐ {data.rating?.toFixed(1) || '0.0'} ({data.userRatingsTotal || 0})
        </Text>
        <Text style={styles.detailsRow}>
          {priceDisplay} · {distanceDisplay}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.cuisine}>{data.cuisineType}</Text>
          <Text style={[styles.status, { color: data.isOpen ? Colors.success : Colors.error }]}>
            {data.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.lightRed,
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightRed,
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    ...Typography.body1,
    fontWeight: 'bold',
    color: Colors.text,
  },
  ratingRow: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailsRow: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cuisine: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  status: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
});
