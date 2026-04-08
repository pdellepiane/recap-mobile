import { EventChallengePhotoScreenPage } from '@/src/features/events/presentation/screens/EventChallengePhotoScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventChallengePhotoRoute() {
  const { id, challengeId, challengeNumber } = useLocalSearchParams<{
    id: string;
    challengeId?: string | string[];
    challengeNumber?: string | string[];
  }>();

  const rid = firstString(challengeId) ?? '';
  const n = Number(firstString(challengeNumber));

  return (
    <EventChallengePhotoScreenPage
      eventId={id ?? ''}
      challengeId={rid}
      challengeNumber={Number.isFinite(n) ? n : undefined}
    />
  );
}
