import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  /** Ciudad (API `city`). */
  city?: string;
  /** Lugar / dirección (API `location`). */
  venue?: string;
  /** Texto completo para mapas cuando faltan partes. */
  mapQuery?: string | null;
  onOpenMap: () => void;
};

export const EventDetailOverviewAddressCard = memo(function EventDetailOverviewAddressCard({
  city,
  venue,
  mapQuery,
  onOpenMap,
}: Props) {
  const { t } = useTranslation();
  const { line1, line2Raw, canOpenMap, a11y } = useMemo(() => {
    const cityT = city?.trim() ?? '';
    const venueT = venue?.trim() ?? '';
    const merged = mapQuery?.trim() ?? '';
    const primary = cityT.length > 0 ? cityT : venueT.length > 0 ? venueT : merged;
    const secondary =
      cityT.length > 0 && venueT.length > 0 && venueT !== cityT ? venueT : '';
    const openMap = merged.length > 0;
    const label =
      secondary.length > 0
        ? `${primary}, ${secondary}`
        : primary.length > 0
          ? primary
          : merged;
    return {
      line1: primary,
      line2Raw: secondary,
      canOpenMap: openMap,
      a11y: label,
    };
  }, [city, mapQuery, venue]);
  const accessibilityLabel = useMemo(
    () => `${a11y}. ${t('common.openInMaps')}`,
    [a11y, t],
  );

  return (
    <Pressable
      disabled={!canOpenMap}
      onPress={onOpenMap}
      style={({ pressed }) => [styles.infoCard, pressed && canOpenMap ? styles.pressed : null]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.iconWell}>
        <Image
          source={images.eventDetail.icons.locationLime}
          style={styles.infoCardIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoCardText}>
        <Text style={styles.infoCardTitle}>{line1}</Text>
        {line2Raw.length > 0 ? <Text style={styles.infoCardSubtitle}>{line2Raw}</Text> : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardIcon: {
    width: 28,
    height: 28,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    color: colors.neutral.lightest,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  infoCardSubtitle: {
    color: colors.neutral.lightest,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
