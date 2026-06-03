import { useMapAppPicker } from '../../hooks/useMapAppPicker';
import { EventDetailMapAppPickerSheet } from './EventDetailMapAppPickerSheet';
import { EventDetailOverviewAddressCard } from './EventDetailOverviewAddressCard';
import { EventDetailOverviewCreatorsRow } from './EventDetailOverviewCreatorsRow';
import { EventDetailOverviewDateCard } from './EventDetailOverviewDateCard';
import { EventDetailOverviewGuestListSection } from './EventDetailOverviewGuestListSection';
import { EventDetailOverviewGuestsSummaryCard } from './EventDetailOverviewGuestsSummaryCard';
import type { EventGuestListRow } from '@/src/features/event-detail/data/eventDetailDerived';
import { useTranslation } from '@/src/i18n';
import { colors, CountdownTimer } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  countdownEndsAt: Date;
  /** Event `datetime` ISO from API. */
  eventDateIso?: string | null;
  addressCity?: string;
  addressVenue?: string;
  /** Merged address for opening maps. */
  mapQuery?: string | null;
  /** GET /api/events/:id — hosts line from API (see `Event.hostsLine` / derived organizer copy). */
  hostsLine: string;
  /** False once the event start time (`event.date`) has passed. */
  isBeforeStartCountdownVisible: boolean;
  /**
   * TODO(backend): Ensure detail payload always includes attending + invited counts for this card.
   */
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
  /** TODO(backend): Full RSVP list on overview when API exposes it beyond `goingGuests`. */
  goingGuests?: EventGuestListRow[];
};

export function EventDetailOverviewTab({
  countdownEndsAt,
  eventDateIso,
  addressCity,
  addressVenue,
  mapQuery,
  hostsLine,
  isBeforeStartCountdownVisible,
  guestsAttendingCount,
  guestsPendingCount,
  goingGuests,
}: Props) {
  const { t } = useTranslation();
  const { visible, apps, openMapPicker, selectMapApp, closePicker } = useMapAppPicker(mapQuery);

  return (
    <>
      <EventDetailOverviewCreatorsRow hostsLine={hostsLine} />

      {isBeforeStartCountdownVisible ? <CountdownTimer endsAt={countdownEndsAt} /> : null}

      <Text style={styles.sectionHeading}>{t('eventDetail.infoHeading')}</Text>

      <EventDetailOverviewDateCard eventDateIso={eventDateIso} />
      {mapQuery && (
        <EventDetailOverviewAddressCard
          city={addressCity}
          venue={addressVenue}
          mapQuery={mapQuery}
          onOpenMap={() => {
            void openMapPicker();
          }}
        />
      )}

      <EventDetailMapAppPickerSheet
        visible={visible}
        apps={apps}
        onClose={closePicker}
        onSelectApp={(appId) => {
          void selectMapApp(appId);
        }}
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
