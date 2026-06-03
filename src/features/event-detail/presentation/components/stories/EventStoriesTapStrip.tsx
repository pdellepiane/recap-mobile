import { useTranslation } from '@/src/i18n';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  chromeStyle: object;
  tapStripTop: number;
  tapStripBottom: number;
  onGoPrev: () => void;
  onGoNext: () => void;
  onPauseProgress: () => void;
  onResumeProgress: () => void;
};

/** Left / right tap zones for previous and next story (center third is inert). */
export function EventStoriesTapStrip({
  chromeStyle,
  tapStripTop,
  tapStripBottom,
  onGoPrev,
  onGoNext,
  onPauseProgress,
  onResumeProgress,
}: Props) {
  const { t } = useTranslation();

  return (
    <Animated.View
      style={[styles.root, chromeStyle, { top: tapStripTop, bottom: tapStripBottom }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={styles.tapThird}
        onPress={onGoPrev}
        onPressIn={onPauseProgress}
        onPressOut={onResumeProgress}
        accessibilityRole="button"
        accessibilityLabel={t('stories.prev')}
      />
      <Pressable
        style={styles.tapThird}
        onPressIn={onPauseProgress}
        onPressOut={onResumeProgress}
        accessibilityRole="button"
        accessibilityLabel={t('stories.holdToPause')}
      />
      <Pressable
        style={styles.tapThird}
        onPress={onGoNext}
        onPressIn={onPauseProgress}
        onPressOut={onResumeProgress}
        accessibilityRole="button"
        accessibilityLabel={t('stories.next')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 3,
  },
  tapThird: {
    flex: 1,
  },
});
