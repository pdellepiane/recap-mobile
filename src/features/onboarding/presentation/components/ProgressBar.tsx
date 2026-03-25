import { StyleSheet, View } from "react-native";

import type { OnboardingSlide } from "../hooks/useOnboarding";

type ProgressBarProps = {
  slides: OnboardingSlide[];
  activeIndex: number;
  topInset: number;
};

export function ProgressBar({
  slides,
  activeIndex,
  topInset,
}: ProgressBarProps) {
  return (
    <View style={[styles.progressContainer, { paddingTop: topInset + 24 }]}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressBar,
            index === activeIndex
              ? styles.progressBarActive
              : styles.progressBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 24,
  },
  progressBar: {
    width: 104,
    height: 8,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: "#333",
  },
  progressBarInactive: {
    backgroundColor: "#d4d4d4",
  },
});
