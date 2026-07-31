import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarIcon = ({ filled, half, size }: { filled: boolean; half?: boolean; size: number }) => {
  const color = filled || half ? '#FBBF24' : '#D1D5DB';
  
  if (half) {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="#D1D5DB">
          <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </Svg>
        <View style={[StyleSheet.absoluteFill, { width: size / 2, overflow: 'hidden' }]}>
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24">
            <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </Svg>
        </View>
      </View>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </Svg>
  );
};

export default function StarRating({ rating, size = 20, interactive = false, onRatingChange }: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const isHalf = !interactive && rating < i && rating > i - 1;
    const isFilled = rating >= i;
    
    const starContent = <StarIcon filled={isFilled} half={isHalf} size={size} />;

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