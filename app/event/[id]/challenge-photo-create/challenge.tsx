import { EventChallengePhotoCreatePreviewScreenPage } from '@/src/features/event-detail/presentation/screens/EventChallengePhotoCreatePreviewScreenPage';
import { useLocalSearchParams } from 'expo-router';

export default function ChallengePhotoCreateChallengeRoute() {
  const {
    id = '',
    challengeId = '',
    challengeNumber,
  } = useLocalSearchParams<{
    id?: string;
    challengeId?: string;
    challengeNumber?: string;
  }>();
  return (
    <EventChallengePhotoCreatePreviewScreenPage
      eventId={id}
      challengeId={challengeId}
      challengeNumber={challengeNumber}
    />
  );
}
