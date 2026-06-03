import { EventChallengePhotoView } from '../components/photo/EventChallengePhotoView';
import { useEventChallengePhotoScreen } from '../hooks/useEventChallengePhotoScreen';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo challenge: card with decorative camera and “Take photo” action.
 */
export function EventChallengePhotoScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const { kicker, instructionParagraphs, handleOpenCamera } = useEventChallengePhotoScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  return (
    <EventChallengePhotoView
      kicker={kicker}
      instructionParagraphs={instructionParagraphs}
      onOpenCamera={handleOpenCamera}
    />
  );
}
