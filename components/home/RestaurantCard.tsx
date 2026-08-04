import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../../constants/colors';
import { Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';
import { RestaurantCardData } from '../../types/restaurant';

interface Props {
  data: RestaurantCardData;
  onPress: (id: string) => void;
}

export const RestaurantCard: React.FC<Props> = ({ data, onPress }) => {
  const priceDisplay = '$'.repeat(
    typeof data.priceLevel === 'string'
      ? data.priceLevel === 'INEXPENSIVE' ? 1 
      : data.priceLevel === 'MODERATE' ? 2
      : data.priceLevel === 'EXPENSIVE' ? 3
      : data.priceLevel === 'VERY_EXPENSIVE' ? 4 : 1
    : 1
  );
  const distanceDisplay = data.distance ? `${data.distance.toFixed(1)} km` : '';
  const cuisineText = data.types?.length ? data.types[0] : '';

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => onPress(data.placeId)}
    >
      <View style={styles.imageContainer}>
        {data.photoUri ? (
          <Image source={{ uri: data.photoUri }} style={styles.image} />
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
          ⭐ {data.rating?.toFixed(1) || '0.0'} ({data.userRatingCount || 0})
        </Text>
        <Text style={styles.detailsRow}>
          {priceDisplay} {distanceDisplay ? `· ${distanceDisplay}` : ''}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.cuisine}>{cuisineText}</Text>
          <Text style={[styles.status, { color: data.openNow ? Colors.success : Colors.error }]}>
            {data.openNow ? 'Aberto' : 'Fechado'}
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
