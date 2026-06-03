import type { EventGuestListRow } from '../../../data/eventDetailDerived';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  /** TODO(backend): Full RSVP list on overview when API exposes it beyond `goingGuests`. */
  goingGuests?: EventGuestListRow[];
};

export function EventDetailOverviewGuestListSection({ goingGuests }: Props) {
  const { t } = useTranslation();
  if (!goingGuests?.length) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionHeading}>{t('eventDetail.guestListHeading')}</Text>
      {goingGuests.map((guest) => (
        <View key={guest.id} style={styles.guestRow}>
          <View style={styles.guestAvatar}>
            <Text style={styles.guestInitial}>{guest.initial}</Text>
          </View>
          <Text style={styles.guestName}>{guest.name}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 10,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestInitial: {
    color: colors.neutral.primary,
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  guestName: {
    color: colors.neutral.primary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
});
