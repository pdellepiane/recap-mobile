import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

const LINES = ['CELEBRA', 'REGALA', 'Y RECIBE', 'DINERO'] as const;

/** Counter-clockwise tilt for the stacked headline (matches banner-state-1 art). */
const TEXT_ROTATE_DEG = '-17deg';

type Props = {
  width: number;
  height: number;
};

/**
 * Vector-style recreation of the “CELEBRA / REGALA / …” disc on the empty-banner slide
 * (replaces `banner-state-1/item-1.png`).
 */
export function NoBannerLeftGraphic({ width, height }: Props) {
  const diameter = Math.max(width, height) * 1.28;
  const radius = diameter / 2;

  return (
    <View style={[styles.clip, { width, height }]}>
      <View
        style={[
          styles.disc,
          {
            width: diameter,
            height: diameter,
            borderRadius: radius,
            left: width * 0.42 - radius,
            top: (height - diameter) / 2,
          },
        ]}
      />
      <View style={[styles.textLayer, { width, height }]} pointerEvents="none">
        <View style={styles.rotated}>
          {LINES.map((line) => (
            <Text key={line} style={styles.line}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  disc: {
    position: 'absolute',
    backgroundColor: colors.background.primary,
  },
  textLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotated: {
    transform: [{ rotate: TEXT_ROTATE_DEG }],
    marginLeft: -4,
    marginTop: 2,
  },
  line: {
    color: colors.accent[500],
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
});
