import { EventDetailParticipantsPanel } from '../components/detail/EventDetailParticipantsPanel';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { organizerParticipantRows } from '@/src/features/event-detail/data/eventDetailDerived';
import { useCoordinator } from '@/src/navigation/useCoordinator';

type Props = {
  eventId: string;
};

export function EventDetailParticipantsScreenPage({ eventId: _eventId }: Props) {
  const { goBack } = useCoordinator();
  const { event, isPublicGuestListEnabled, setIsPublicGuestListEnabled } = useEventDetailRoute();

  return (
    <EventDetailParticipantsPanel
      participants={organizerParticipantRows(event)}
      isPublicListEnabled={isPublicGuestListEnabled}
      onTogglePublicList={setIsPublicGuestListEnabled}
      onClose={goBack}
    />
  );
}
