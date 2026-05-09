import { EventChallengePhotoCreatePreviewScreenPage } from '@/src/features/event-detail/presentation/screens/EventChallengePhotoCreatePreviewScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengePhotoCreateChallengeRoute() {
  const { challengeId } = useLocalSearchParams<{
    challengeId?: string | string[];
  }>();
  const cid = firstString(challengeId) ?? '';
  return <EventChallengePhotoCreatePreviewScreenPage challengeId={cid} />;
}
