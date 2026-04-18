import { BannerCoverCirclePlaceholder } from './BannerCoverCirclePlaceholder';
import { colors } from '@/src/ui';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

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
  const outerStyle = variant === 'live' ? styles.liveOuter : styles.scheduledOuter;

  return (
    <View
      style={[
        outerStyle,
        {
          width: diameter,
          height: diameter,
          borderRadius: r,
        },
        style,
      ]}
    >
      {trimmed ? (
        <Image source={{ uri: trimmed }} style={styles.image} resizeMode="cover" />
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
    zIndex: 1,
    borderWidth: 8,
    borderColor: colors.events.homeBannerLiveLime,
    backgroundColor: colors.background.tertiary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
