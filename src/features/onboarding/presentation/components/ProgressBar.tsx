import type { OnboardingSlide } from '../data';
import { colors } from '@/src/ui/colors';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  slides: OnboardingSlide[];
  activeIndex: number;
  topInset: number;
};

export function ProgressBar({ slides, activeIndex, topInset }: ProgressBarProps) {
  return (
    <View style={[styles.progressContainer, { paddingTop: topInset + 24 }]}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressBar,
            index === activeIndex ? styles.progressBarActive : styles.progressBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  progressBar: {
    width: 104,
    height: 8,
    borderRadius: 8,
  },
  progressBarActive: {
    backgroundColor: colors.background.primary,
  },
  progressBarInactive: {
    backgroundColor: colors.neutral.secondary,
  },
});
