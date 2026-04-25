import type { EventDetailExtras } from '../../data/eventDetailExtras';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, CountdownTimer, HostInitialsAvatar, parseHostsFromLine } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  description: string;
  countdownEndsAt: Date;
  mapsQuery: string | null;
  venueLine1: string;
  venueLine2: string;
  extras: EventDetailExtras | null;
  /** GET /api/events/:id `hosts` when remote; otherwise {@link EventDetailExtras.hostsLine} when provided. */
  hostsLine: string;
  /** False on the event’s calendar day and when extras hide the countdown (e.g. live). */
  showDetailCountdown: boolean;
  onOpenMap: () => void;
};

export function EventDetailOverviewTab({
  description,
  countdownEndsAt,
  mapsQuery,
  venueLine1,
  venueLine2,
  extras,
  hostsLine,
  showDetailCountdown,
  onOpenMap,
}: Props) {
  const { t } = useTranslation();
  const hostNames = parseHostsFromLine(hostsLine);

  return (
    <>
      <View style={styles.creatorsRow}>
        <View style={styles.creatorAvatars}>
          {hostNames.map((name, i) => (
            <HostInitialsAvatar
              key={`${name}-${i}`}
              fullName={name}
              colorIndex={i}
              style={
                i > 0
                  ? { marginLeft: -14, zIndex: hostNames.length - i }
                  : { zIndex: hostNames.length }
              }
            />
          ))}
        </View>
        <View style={styles.creatorsTextCol}>
          <Text style={styles.creatorsLabel}>{t('eventDetail.creatorsLabel')}</Text>
          <Text style={styles.creatorsNames}>{hostsLine}</Text>
        </View>
      </View>

      {showDetailCountdown ? <CountdownTimer endsAt={countdownEndsAt} /> : null}

      <Text style={styles.sectionHeading}>{t('eventDetail.infoHeading')}</Text>
      <Text style={styles.bodyText}>{description}</Text>

      <Pressable
        disabled={!mapsQuery}
        onPress={onOpenMap}
        style={({ pressed }) => [styles.infoCard, pressed && mapsQuery ? styles.pressed : null]}
        accessibilityRole="button"
        accessibilityLabel={t('common.viewLocationInGoogleMaps')}
      >
        <Image
          source={images.eventDetail.icons.locationLime}
          style={styles.infoCardIcon}
          resizeMode="contain"
        />
        <View style={styles.infoCardText}>
          <Text style={styles.infoCardTitle}>{venueLine1}</Text>
          {venueLine2 ? <Text style={styles.infoCardSub}>{venueLine2}</Text> : null}
        </View>
      </Pressable>

      <View style={styles.infoCard}>
        <Image
          source={images.eventDetail.icons.guestsLime}
          style={styles.infoCardIcon}
          resizeMode="contain"
        />
        <View style={styles.infoCardText}>
          <Text style={styles.infoCardTitle}>
            {extras
              ? t('eventDetail.guestsConfirmedTitle', { count: extras.guestsConfirmed })
              : t('eventDetail.guestsCardTitle')}
          </Text>
          {extras ? (
            <Text style={styles.infoCardSub}>
              {t('eventDetail.guestsPendingSub', { count: extras.guestsPending })}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.sectionHeading}>{t('eventDetail.guestListHeading')}</Text>
      {(extras?.confirmedGuests ?? [{ id: 'x', name: t('eventDetail.guestPlaceholder') }]).map(
        (g) => (
          <View key={g.id} style={styles.guestRow}>
            <View style={styles.guestAvatar}>
              <Text style={styles.guestInitial}>{g.name.charAt(0)}</Text>
            </View>
            <Text style={styles.guestName}>{g.name}</Text>
          </View>
        ),
      )}
    </>
  );
}

const styles = StyleSheet.create({
  creatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  creatorAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorsTextCol: {
    flex: 1,
  },
  creatorsLabel: {
    color: colors.neutral.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
  creatorsNames: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    marginTop: 2,
  },
  sectionHeading: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 10,
  },
  bodyText: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  infoCardIcon: {
    width: 28,
    height: 28,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  infoCardSub: {
    color: colors.neutral.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    marginTop: 2,
  },
  pressed: {
    opacity: 0.85,
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
  guestNameBold: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    color: colors.neutral.primary,
  },
});
