import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type GoingGuest = { id: string; name?: string | null };

type Props = {
  /** TODO(backend): Full RSVP list on overview when API exposes it beyond `goingGuests`. */
  goingGuests?: GoingGuest[];
};

export function EventDetailOverviewGuestListSection({ goingGuests }: Props) {
  const { t } = useTranslation();
  const guestListSource =
    goingGuests && goingGuests.length > 0
      ? goingGuests
      : [{ id: 'placeholder', name: t('eventDetail.guestPlaceholder') }];

  return (
    <>
      <Text style={styles.sectionHeading}>{t('eventDetail.guestListHeading')}</Text>
      {guestListSource.map((g) => {
        const displayName = g.name?.trim() || t('eventDetail.guestPlaceholder');
        return (
          <View key={g.id} style={styles.guestRow}>
            <View style={styles.guestAvatar}>
              <Text style={styles.guestInitial}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.guestName}>{displayName}</Text>
          </View>
        );
      })}
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
