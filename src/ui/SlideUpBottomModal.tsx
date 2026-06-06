import { colors } from './colors';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
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
  const { height: windowHeight } = useWindowDimensions();
  const slideDistance = Math.min(480, windowHeight * 0.55);
  const translateY = useRef(new Animated.Value(slideDistance)).current;
  const dimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const slide = slideDistance;
    if (!visible) {
      translateY.stopAnimation();
      dimOpacity.stopAnimation();
      translateY.setValue(slide);
      dimOpacity.setValue(0);
      return;
    }
    translateY.setValue(slide);
    dimOpacity.setValue(0);
    const animation = Animated.parallel([
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
    ]);
    animation.start();
    return () => {
      animation.stop();
      translateY.stopAnimation();
      dimOpacity.stopAnimation();
    };
  }, [slideDistance, visible, translateY, dimOpacity]);

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
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderRadius: 32,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 26,
    overflow: 'hidden',
  },
});
