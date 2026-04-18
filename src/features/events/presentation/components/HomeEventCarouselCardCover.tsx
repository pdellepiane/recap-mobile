import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

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
  return (
    <View style={styles.imageWrap}>
      {coverImageUrl ? (
        <Image source={{ uri: coverImageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeDay}>{day}</Text>
        <Text style={styles.dateBadgeMonth}>{month}</Text>
      </View>
      <View style={styles.coverFooter}>
        <View style={styles.coverChip}>
          <Text style={styles.coverChipInitials}>{coverInitials || '·'}</Text>
        </View>
        <Text style={styles.coverChipLabel} numberOfLines={1}>
          {coverLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    height: IMG_H,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.background.elevated,
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    minWidth: 56,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.overlay.black55,
    borderRadius: 12,
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
    backgroundColor: colors.events.homeCardCoverTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverChipInitials: {
    color: colors.events.homeCardCoverOnTeal,
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
