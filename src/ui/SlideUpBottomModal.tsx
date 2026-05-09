import { colors } from './colors';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

export type SlideUpBottomModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  /** Padding around the sheet (horizontal gutters, bottom inset). */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Card that slides up (e.g. radius, background, padding). */
  sheetStyle?: StyleProp<ViewStyle>;
  /** Backdrop color (opacity is animated 0 → 1). */
  dimColor?: string;
};

function slideDistancePx(): number {
  return Math.min(480, Dimensions.get('window').height * 0.55);
}

/**
 * Full-screen dim + sheet that springs up from below. Uses `animationType="none"` on `Modal`
 * so timing matches on iOS and Android (transparent `slide` is unreliable).
 */
export function SlideUpBottomModal({
  visible,
  onRequestClose,
  children,
  contentContainerStyle,
  sheetStyle,
  dimColor = colors.overlay.black70,
}: SlideUpBottomModalProps) {
  const translateY = useRef(new Animated.Value(slideDistancePx())).current;
  const dimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const slide = slideDistancePx();
    if (!visible) {
      translateY.setValue(slide);
      dimOpacity.setValue(0);
      return;
    }
    translateY.setValue(slide);
    dimOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(dimOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 9,
        tension: 68,
      }),
    ]).start();
  }, [visible, translateY, dimOpacity]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose}>
      <View style={[styles.overlayContainer, contentContainerStyle]}>
        <Animated.View style={[styles.dim, { backgroundColor: dimColor, opacity: dimOpacity }]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        <Animated.View style={[styles.sheet, sheetStyle, { transform: [{ translateY }] }]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    overflow: 'hidden',
  },
});
