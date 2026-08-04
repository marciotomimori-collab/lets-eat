import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 20, interactive = false, onRatingChange }: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const isFilled = rating >= i;
    
    const starContent = <Text style={{ fontSize: size, color: isFilled ? '#FBBF24' : '#D1D5DB' }}>{isFilled ? '⭐' : '☆'}</Text>;

    if (interactive) {
      stars.push(
        <TouchableOpacity 
          key={i} 
          activeOpacity={0.7} 
          onPress={() => onRatingChange && onRatingChange(i)}
          style={styles.starPadding}
        >
          {starContent}
        </TouchableOpacity>
      );
    } else {
      stars.push(
        <View key={i} style={styles.starPadding}>
          {starContent}
        </View>
      );
    }
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starPadding: {
    paddingRight: 2,
  },
});