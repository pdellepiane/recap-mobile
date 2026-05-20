import { EventDetailOverviewAddressCard } from './EventDetailOverviewAddressCard';
import { EventDetailOverviewCreatorsRow } from './EventDetailOverviewCreatorsRow';
import { EventDetailOverviewDateCard } from './EventDetailOverviewDateCard';
import { EventDetailOverviewGuestListSection } from './EventDetailOverviewGuestListSection';
import { EventDetailOverviewGuestsSummaryCard } from './EventDetailOverviewGuestsSummaryCard';
import { useTranslation } from '@/src/i18n';
import { colors, CountdownTimer } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type GoingGuest = { id: string; name: string };

type Props = {
  description: string;
  countdownEndsAt: Date;
  /** Event `datetime` ISO from API. */
  eventDateIso: string;
  addressCity?: string;
  addressVenue?: string;
  /** Merged address for opening maps. */
  mapQuery: string;
  /** GET /api/events/:id — hosts line from API (see `Event.hostsLine` / derived organizer copy). */
  hostsLine: string;
  /** False once the event start time (`event.date`) has passed. */
  isBeforeStartCountdownVisible: boolean;
  onOpenMap: () => void;
  /**
   * TODO(backend): Ensure detail payload always includes attending + invited counts for this card.
   */
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
  /** TODO(backend): Full RSVP list on overview when API exposes it beyond `goingGuests`. */
  goingGuests?: GoingGuest[];
};

export function EventDetailOverviewTab({
  description,
  countdownEndsAt,
  eventDateIso,
  addressCity,
  addressVenue,
  mapQuery,
  hostsLine,
  isBeforeStartCountdownVisible,
  onOpenMap,
  guestsAttendingCount,
  guestsPendingCount,
  goingGuests,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EventDetailOverviewCreatorsRow hostsLine={hostsLine} />

      {isBeforeStartCountdownVisible ? <CountdownTimer endsAt={countdownEndsAt} /> : null}

      <Text style={styles.sectionHeading}>{t('eventDetail.infoHeading')}</Text>
      <Text style={styles.bodyText}>{description}</Text>

      <EventDetailOverviewDateCard eventDateIso={eventDateIso} />
      <EventDetailOverviewAddressCard
        city={addressCity}
        venue={addressVenue}
        mapQuery={mapQuery}
        onOpenMap={onOpenMap}
      />

      <EventDetailOverviewGuestsSummaryCard
        guestsAttendingCount={guestsAttendingCount}
        guestsPendingCount={guestsPendingCount}
      />

      <EventDetailOverviewGuestListSection goingGuests={goingGuests} />
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
  bodyText: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    marginBottom: 20,
  },
});
