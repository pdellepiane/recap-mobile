import type { OnboardingSlide } from '../data';
import {
  scaledOnboardingSize,
  useOnboardingScale,
} from '../utils/onboardingLayout';
import { colors } from '@/src/ui/colors';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  slides: OnboardingSlide[];
  activeIndex: number;
  topInset: number;
};

export function ProgressBar({ slides, activeIndex, topInset }: ProgressBarProps) {
  const scale = useOnboardingScale();

  const layout = useMemo(
    () => ({
      paddingTop: topInset + scaledOnboardingSize(24, scale),
      paddingBottom: scaledOnboardingSize(24, scale),
      gap: scaledOnboardingSize(8, scale),
      barWidth: scaledOnboardingSize(104, scale),
      barHeight: scaledOnboardingSize(8, scale),
      borderRadius: scaledOnboardingSize(8, scale),
    }),
    [scale, topInset],
  );

  return (
    <View
      style={[
        styles.progressContainer,
        {
          paddingTop: layout.paddingTop,
          paddingBottom: layout.paddingBottom,
          gap: layout.gap,
        },
      ]}
    >
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressBar,
            {
              width: layout.barWidth,
              height: layout.barHeight,
              borderRadius: layout.borderRadius,
            },
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
  },
  progressBar: {},
  progressBarActive: {
    backgroundColor: colors.background.primary,
  },
  progressBarInactive: {
    backgroundColor: colors.neutral.secondary,
  },
});
