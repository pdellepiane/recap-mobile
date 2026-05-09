import { EventChallengePhotoCreateScreenPage } from '@/src/features/event-detail/presentation/screens/EventChallengePhotoCreateScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengePhotoCreateIndexRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const eventId = firstString(id) ?? '';
  return <EventChallengePhotoCreateScreenPage eventId={eventId} />;
}
