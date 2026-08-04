import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal as RNModal, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  PanResponder 
} from 'react-native';
import Colors from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';

const { height } = Dimensions.get('window');

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ visible, onClose, title, children }: ModalProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 90,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height / 4 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible && (fadeAnim as any)._value === 0 && (slideAnim as any)._value === height) {
    return null;
  }

  return (
    <RNModal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />
        </Animated.View>
        <Animated.View 
          style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
          <View {...panResponder.panHandlers} style={styles.header}>
            <View style={styles.handle} />
            {title && <Text style={styles.title}>{title}</Text>}
          </View>
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: height * 0.3,
    maxHeight: height * 0.9,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.lg,
    color: '#111827',
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
});