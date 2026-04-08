import { EventChallengePhotoCompletedScreenPage } from '@/src/features/events/presentation/screens/EventChallengePhotoCompletedScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventChallengePhotoCompletedRoute() {
  const { id, challengeId, challengeNumber, points } = useLocalSearchParams<{
    id: string;
    challengeId?: string | string[];
    challengeNumber?: string | string[];
    points?: string | string[];
  }>();

  const rid = firstString(challengeId) ?? '';
  const n = Number(firstString(challengeNumber));
  const p = Number(firstString(points));

  return (
    <EventChallengePhotoCompletedScreenPage
      eventId={id ?? ''}
      challengeId={rid}
      challengeNumber={Number.isFinite(n) ? n : 2}
      points={Number.isFinite(p) ? p : 10}
    />
  );
}
