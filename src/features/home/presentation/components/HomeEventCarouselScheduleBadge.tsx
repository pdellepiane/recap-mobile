import { images } from '@/src/assets/images';
import { EventType } from '@/src/core/api';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  type: EventType;
};

/**
 * Badge “en vivo” / “programado” sobre la tarjeta del carrusel de home.
 *
 * Does not use `homeLiveBannerCarousel/bannerKind.ts`: those helpers expect a `HomeBannerItem`
 * and `banner_type` from GET /api/home/banners. This badge uses `HomeCarouselScheduleKind` from
 * the event date via `getHomeCarouselScheduleKind` (client calendar), not banner API types.
 */
export function HomeEventCarouselScheduleBadge({ type }: Props) {
  if (type === EventType.EventLive) {
    return (
      <View style={styles.row}>
        <Image
          source={images.common.live}
          style={styles.icon}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={[styles.text, { color: colors.accent[500] }]}>Evento en vivo</Text>
      </View>
    );
  }
  if (type === EventType.EventToStart) {
    return (
      <View style={styles.row}>
        <Image
          source={images.common.scheduled}
          style={styles.icon}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <Text style={[styles.text, { color: colors.states.warning }]}>Evento programado</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
