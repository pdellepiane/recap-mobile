import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  /**
   * TODO(backend): Ensure detail payload always includes attending + invited counts for this card.
   */
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
};

export const EventDetailOverviewGuestsSummaryCard = memo(function EventDetailOverviewGuestsSummaryCard({
  guestsAttendingCount,
  guestsPendingCount,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.infoCard}>
      <View style={styles.iconWell}>
        <Image
          source={images.eventDetail.icons.guestsLime}
          style={styles.infoCardIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoCardText}>
        <Text style={styles.infoCardTitle}>
          {guestsAttendingCount !== undefined
            ? t('eventDetail.guestsConfirmedTitle', { count: guestsAttendingCount })
            : t('eventDetail.guestsCardTitle')}
        </Text>
        {guestsPendingCount !== undefined ? (
          <Text style={styles.infoCardSub}>
            {t('eventDetail.guestsPendingSub', { count: guestsPendingCount })}
          </Text>
        ) : null}
      </View>
    </View>
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
  infoCardSub: {
    color: colors.neutral.lightest,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    marginTop: 2,
  },
});
