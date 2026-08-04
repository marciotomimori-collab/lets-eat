import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/colors';
import { Typography, Spacing, Shadows } from '../../constants/theme';

interface Props {
  onReveal: () => void;
  isRevealing: boolean;
}

export const SurprisePlate: React.FC<Props> = ({ onReveal, isRevealing }) => {
  const { t } = useTranslation();
  const pan = useRef(new Animated.ValueXY()).current;
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (!isRevealing && hasRevealed) {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  }, [isRevealing, hasRevealed, pan]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !isRevealing,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < -100) {
          // Swipe up threshold met
          Animated.timing(pan, {
            toValue: { x: 0, y: -300 },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setHasRevealed(true);
            onReveal();
            // Reset position after a delay
            setTimeout(() => {
              pan.setValue({ x: 0, y: 0 });
            }, 1000);
          });
        } else {
          // Reset if threshold not met
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.plate,
          {
            transform: [{ translateY: pan.y }],
            opacity: pan.y.interpolate({
              inputRange: [-200, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.emoji}>🍝</Text>
      </Animated.View>
      
      <View style={styles.hintContainer}>
        {!hasRevealed ? (
          <Text style={styles.hintText}>{t('surprise.hint', '↑ Arraste para cima')}</Text>
        ) : (
          <Text style={styles.hintText}>{t('surprise.again', 'Não curtiu? Arraste de novo!')}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  plate: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: Colors.lightGray,
    ...Shadows.md,
    zIndex: 2,
  },
  emoji: {
    fontSize: 80,
  },
  hintContainer: {
    marginTop: Spacing.xl,
    zIndex: 1,
  },
  hintText: {
    ...Typography.body1,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
