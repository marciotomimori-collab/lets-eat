import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '../../constants/theme';

export interface PriceLevelProps {
  level: string | number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceLevel({ level, size = 'md' }: PriceLevelProps) {
  let numLevel = 0;
  
  if (typeof level === 'number') {
    numLevel = level;
  } else if (typeof level === 'string') {
    if (level.includes('INEXPENSIVE')) numLevel = 1;
    else if (level.includes('MODERATE')) numLevel = 2;
    else if (level.includes('EXPENSIVE')) numLevel = 3;
    else if (level.includes('VERY_EXPENSIVE')) numLevel = 4;
  }

  // Cap between 1 and 4
  numLevel = Math.max(1, Math.min(4, numLevel || 1));

  const getColor = (tier: number) => {
    switch (tier) {
      case 1: return '#10B981'; // Green
      case 2: return '#F59E0B'; // Yellow
      case 3: return '#EF4444'; // Red
      case 4: return '#8B5CF6'; // Purple
      default: return '#10B981';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return Typography.sizes.sm;
      case 'lg': return Typography.sizes.lg;
      case 'md':
      default: return Typography.sizes.md;
    }
  };

  const activeColor = getColor(numLevel);
  const inactiveColor = '#D1D5DB';
  const fontSize = getFontSize();

  const signs = [1, 2, 3, 4].map((i) => (
    <Text 
      key={i} 
      style={[
        styles.sign, 
        { fontSize, color: i <= numLevel ? activeColor : inactiveColor }
      ]}
    >
      $
    </Text>
  ));

  return <View style={styles.container}>{signs}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sign: {
    fontFamily: Typography.fonts.bold,
  },
});