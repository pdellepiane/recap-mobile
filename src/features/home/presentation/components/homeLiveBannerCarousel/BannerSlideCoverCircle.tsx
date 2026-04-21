import { BannerCoverCirclePlaceholder } from './BannerCoverCirclePlaceholder';
import { colors } from '@/src/ui';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

/** Dark olive outer ring (px). */
const LIVE_OUTER_RING = 6;
/** Bright lime inner ring (px). */
const LIVE_INNER_RING = 6;

export type BannerSlideCoverCircleProps = {
  diameter: number;
  /** Cover URL; empty string shows {@link BannerCoverCirclePlaceholder}. */
  uri: string;
  variant: 'scheduled' | 'live';
  style?: StyleProp<ViewStyle>;
};

export function BannerSlideCoverCircle({
  diameter,
  uri,
  variant,
  style,
}: BannerSlideCoverCircleProps) {
  const r = diameter / 2;
  const trimmed = uri.trim();

  if (variant === 'live') {
    const innerSize = diameter - 2 * LIVE_OUTER_RING;
    const innerR = innerSize / 2;

    return (
      <View
        style={[
          styles.liveOuter,
          {
            width: diameter,
            height: diameter,
            borderRadius: r,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.liveInner,
            {
              width: innerSize,
              height: innerSize,
            },
          ]}
        >
          {trimmed ? (
            <Image
              source={{ uri: trimmed }}
              style={[styles.image, { borderRadius: innerR }]}
              resizeMode="cover"
            />
          ) : (
            <BannerCoverCirclePlaceholder />
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.scheduledOuter,
        {
          width: diameter,
          height: diameter,
          borderRadius: r,
        },
        style,
      ]}
    >
      {trimmed ? (
        <Image
          source={{ uri: trimmed }}
          style={[styles.image, { borderRadius: r }]}
          resizeMode="cover"
        />
      ) : (
        <BannerCoverCirclePlaceholder />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scheduledOuter: {
    overflow: 'hidden',
    zIndex: 1,
    right: 21,
    top: 2,
  },
  liveOuter: {
    overflow: 'hidden',
    borderWidth: LIVE_OUTER_RING,
    borderColor: colors.accent[500],
    top: 27,
    left: 13,
  },
  liveInner: {
    overflow: 'hidden',
    borderWidth: LIVE_INNER_RING,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
