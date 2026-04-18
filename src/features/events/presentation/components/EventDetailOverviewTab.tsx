import { CountdownTimer, colors, HostInitialsAvatar, parseHostsFromLine } from '@/src/ui';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { EventDetailExtras } from '../data/eventDetailExtras';

const ICON_EVENT_LOCATION = require('../../../../../assets/images/event-detail/icon-location-lime.png');
const ICON_EVENT_GUESTS = require('../../../../../assets/images/event-detail/icon-guests-lime.png');

type EventDetailOverviewTabProps = {
  description: string;
  countdownEndsAt: Date;
  mapsQuery: string | null;
  venueLine1: string;
  venueLine2: string;
  extras: EventDetailExtras | null;
  /** GET /api/events/:id `hosts` when remote; otherwise {@link EventDetailExtras.hostsLine} for legacy mocks. */
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
}: EventDetailOverviewTabProps) {
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
          <Text style={styles.creatorsLabel}>Evento creado por</Text>
          <Text style={styles.creatorsNames}>{hostsLine}</Text>
        </View>
      </View>

      {showDetailCountdown ? (
        <CountdownTimer endsAt={countdownEndsAt} />
      ) : null}

      <Text style={styles.sectionHeading}>Información del evento</Text>
      <Text style={styles.bodyText}>{description}</Text>

      <Pressable
        disabled={!mapsQuery}
        onPress={onOpenMap}
        style={({ pressed }) => [styles.infoCard, pressed && mapsQuery ? styles.pressed : null]}
        accessibilityRole="button"
        accessibilityLabel="Ver ubicación en Google Maps"
      >
        <Image source={ICON_EVENT_LOCATION} style={styles.infoCardIcon} resizeMode="contain" />
        <View style={styles.infoCardText}>
          <Text style={styles.infoCardTitle}>{venueLine1}</Text>
          {venueLine2 ? <Text style={styles.infoCardSub}>{venueLine2}</Text> : null}
        </View>
      </Pressable>

      <View style={styles.infoCard}>
        <Image source={ICON_EVENT_GUESTS} style={styles.infoCardIcon} resizeMode="contain" />
        <View style={styles.infoCardText}>
          <Text style={styles.infoCardTitle}>
            {extras ? `${String(extras.guestsConfirmed)} invitados confirmados` : 'Invitados'}
          </Text>
          {extras ? (
            <Text style={styles.infoCardSub}>
              {`${String(extras.guestsPending)} invitados por confirmar`}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.sectionHeading}>Lista de invitados confirmados</Text>
      {(extras?.confirmedGuests ?? [{ id: 'x', name: 'Invitado' }]).map((g) => (
        <View key={g.id} style={styles.guestRow}>
          <View style={styles.guestAvatar}>
            <Text style={styles.guestInitial}>{g.name.charAt(0)}</Text>
          </View>
          <Text style={styles.guestName}>{g.name}</Text>
        </View>
      ))}
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
    fontSize: 13,
  },
  creatorsNames: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeading: {
    color: colors.neutral.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  bodyText: {
    color: colors.neutral.primary,
    fontSize: 15,
    lineHeight: 22,
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
    fontSize: 16,
    fontWeight: '700',
  },
  infoCardSub: {
    color: colors.neutral.secondary,
    fontSize: 14,
    marginTop: 4,
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
    fontWeight: '700',
    fontSize: 16,
  },
  guestName: {
    color: colors.neutral.primary,
    fontSize: 16,
  },
});
