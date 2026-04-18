import { colors } from '@/src/ui';
import { Pressable, StyleSheet, View } from 'react-native';

export type HomeLiveBannerCarouselDotsProps = {
  count: number;
  activeIndex: number;
  onDotPress: (index: number) => void;
};

export function HomeLiveBannerCarouselDots({
  count,
  activeIndex,
  onDotPress,
}: HomeLiveBannerCarouselDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <Pressable
          key={`dot-${String(i)}`}
          accessibilityRole="button"
          accessibilityLabel={`Ir a banner ${String(i + 1)} de ${String(count)}`}
          accessibilityState={{ selected: i === activeIndex }}
          hitSlop={8}
          onPress={() => {
            onDotPress(i);
          }}
          style={({ pressed }) => [styles.dotHit, pressed && styles.dotHitPressed]}
        >
          <View style={[styles.pill, i === activeIndex ? styles.pillActive : styles.pillInactive]} />
        </Pressable>
      ))}
    </View>
  );
}

const PILL_H = 4;
const PILL_INACTIVE_W = 12;
const PILL_ACTIVE_W = 32;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  dotHit: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  dotHitPressed: {
    opacity: 0.85,
  },
  pill: {
    height: PILL_H,
    borderRadius: PILL_H / 2,
  },
  pillInactive: {
    width: PILL_INACTIVE_W,
    backgroundColor: colors.neutral.disabled,
  },
  pillActive: {
    width: PILL_ACTIVE_W,
    backgroundColor: colors.neutral.primary,
  },
});
