import type { MapAppId } from '../../../data/mapApps';
import { useMapAppPicker } from '../../hooks/useMapAppPicker';
import { EventDetailMapAppPickerSheet } from './EventDetailMapAppPickerSheet';
import { EventDetailOverviewAddressCard } from './EventDetailOverviewAddressCard';
import { EventDetailOverviewCreatorsRow } from './EventDetailOverviewCreatorsRow';
import { EventDetailOverviewDateCard } from './EventDetailOverviewDateCard';
import { EventDetailOverviewGuestListSection } from './EventDetailOverviewGuestListSection';
import { EventDetailOverviewGuestsSummaryCard } from './EventDetailOverviewGuestsSummaryCard';
import {
  isEventDetailBeforeStartCountdownVisible,
  type EventGuestListRow,
} from '@/src/features/event-detail/data/eventDetailDerived';
import { useTranslation } from '@/src/i18n';
import { colors, CountdownTimer } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useCallback, useMemo } from 'react';
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
  /**
   * TODO(backend): Ensure detail payload always includes attending + invited counts for this card.
   */
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
  /** TODO(backend): Full RSVP list on overview when API exposes it beyond `goingGuests`. */
  goingGuests?: EventGuestListRow[];
};

export const EventDetailOverviewTab = memo(function EventDetailOverviewTab({
  countdownEndsAt,
  eventDateIso,
  addressCity,
  addressVenue,
  mapQuery,
  hostsLine,
  guestsAttendingCount,
  guestsPendingCount,
  goingGuests,
}: Props) {
  const { t } = useTranslation();
  const { visible, apps, openMapPicker, selectMapApp, closePicker } = useMapAppPicker(mapQuery);
  const isBeforeStartCountdownVisible = useMemo(
    () => isEventDetailBeforeStartCountdownVisible(eventDateIso, new Date()),
    [eventDateIso],
  );
  const onOpenMap = useCallback(() => {
    void openMapPicker();
  }, [openMapPicker]);
  const onSelectMapApp = useCallback(
    (appId: MapAppId) => {
      void selectMapApp(appId);
    },
    [selectMapApp],
  );

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
          onOpenMap={onOpenMap}
        />
      )}

      <EventDetailMapAppPickerSheet
        visible={visible}
        apps={apps}
        onClose={closePicker}
        onSelectApp={onSelectMapApp}
      />

      <EventDetailOverviewGuestsSummaryCard
        guestsAttendingCount={guestsAttendingCount}
        guestsPendingCount={guestsPendingCount}
      />

      <EventDetailOverviewGuestListSection goingGuests={goingGuests} />
    </>
  );
});

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
