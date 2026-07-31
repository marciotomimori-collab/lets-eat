import React, { useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  View 
} from 'react-native';
import Colors from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

export interface ChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
}

export default function Chip({ label, emoji, selected = false, onPress }: ChipProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, selected ? styles.selectedContainer : styles.unselectedContainer]}
      >
        <View style={styles.content}>
          {emoji && <Text style={styles.emoji}>{emoji}</Text>}
          <Text style={[styles.label, selected ? styles.selectedLabel : styles.unselectedLabel]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 9999, // Pill shape
    alignSelf: 'flex-start',
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  unselectedContainer: {
    backgroundColor: '#F3F4F6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: Typography.sizes.md,
    marginRight: Spacing.xs,
  },
  label: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
  },
  selectedLabel: {
    color: Colors.white,
  },
  unselectedLabel: {
    color: '#374151',
  },
});