import { EventDetailParticipantsPanel } from '../components/EventDetailParticipantsPanel';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { buildOrganizerParticipantRows } from '@/src/features/event-detail/data/eventDetailDerived';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useMemo } from 'react';

type Props = {
  eventId: string;
};

export function EventDetailParticipantsScreenPage({ eventId: _eventId }: Props) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { event, isPublicGuestListEnabled, setIsPublicGuestListEnabled } = useEventDetailRoute();

  const participantRows = useMemo(
    () => buildOrganizerParticipantRows(event, t('eventDetail.guestPlaceholder')),
    [event, t],
  );

  return (
    <EventDetailParticipantsPanel
      participants={participantRows}
      isPublicListEnabled={isPublicGuestListEnabled}
      onTogglePublicList={setIsPublicGuestListEnabled}
      onClose={goBack}
    />
  );
}
