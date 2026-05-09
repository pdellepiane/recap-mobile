import { appendRemoteImageEpoch, colors, useRemoteImageCacheEpoch } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const IMG_H = 160;
const COVER_CHIP = 28;

type Props = {
  coverImageUrl?: string | null;
  day: string;
  month: string;
  coverInitials: string;
  coverLabel: string;
};

/** Imagen de portada, badge de fecha y chip de anfitrión/invitado en la tarjeta del carrusel. */
export function HomeEventCarouselCardCover({
  coverImageUrl,
  day,
  month,
  coverInitials,
  coverLabel,
}: Props) {
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const sourceUri = coverImageUrl ? appendRemoteImageEpoch(coverImageUrl, mediaCacheEpoch) : null;
  return (
    <View style={styles.imageWrap}>
      {sourceUri ? (
        <ExpoImage
          source={{ uri: sourceUri }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <LinearGradient
        colors={[colors.background.primary, colors.neutral.primary]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottomGradientStrong}
        pointerEvents="none"
      />
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeDay}>{day}</Text>
        <Text style={styles.dateBadgeMonth}>{month}</Text>
      </View>
      {coverLabel && (
        <View style={styles.coverFooter}>
          <View style={styles.coverChip}>
            <Text style={styles.coverChipInitials}>{coverInitials || '·'}</Text>
          </View>
          <Text style={styles.coverChipLabel} numberOfLines={1}>
            Por {coverLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    height: IMG_H,
    width: '100%',
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.background.elevated,
  },
  bottomGradientStrong: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    mixBlendMode: 'multiply',
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    minWidth: 56,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDay: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  dateBadgeMonth: {
    color: colors.neutral.primary,
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
    fontFamily: fontFamilies.signikaRegular,
    lineHeight: 16,
  },
  coverFooter: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coverChip: {
    width: COVER_CHIP,
    height: COVER_CHIP,
    borderRadius: COVER_CHIP / 2,
    backgroundColor: colors.states.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverChipInitials: {
    color: colors.background.primary,
    fontSize: 8,
    fontWeight: '600',
    fontFamily: fontFamilies.signikaSemiBold,
  },
  coverChipLabel: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fontFamilies.signikaRegular,
    lineHeight: 20,
  },
});
