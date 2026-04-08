import { EventChallengeQuizScreenPage } from '@/src/features/events/presentation/screens/EventChallengeQuizScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventChallengeQuizRoute() {
  const { id, challengeId, challengeNumber } = useLocalSearchParams<{
    id?: string | string[];
    challengeId?: string | string[];
    challengeNumber?: string | string[];
  }>();

  const eventId = firstString(id) ?? '';
  const rid = firstString(challengeId) ?? '';
  const n = Number(firstString(challengeNumber));

  return (
    <EventChallengeQuizScreenPage
      eventId={eventId}
      challengeId={rid}
      challengeNumber={Number.isFinite(n) ? n : undefined}
    />
  );
}
