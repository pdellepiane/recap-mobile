import { EventChallengeQuizCreatePreviewScreenPage } from '@/src/features/event-detail/presentation/screens/EventChallengeQuizCreatePreviewScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengeQuizCreateQuestionRoute() {
  const { id, questionId } = useLocalSearchParams<{
    id?: string | string[];
    questionId?: string | string[];
  }>();
  const eventId = firstString(id) ?? '';
  const qid = firstString(questionId) ?? '';
  return <EventChallengeQuizCreatePreviewScreenPage eventId={eventId} questionId={qid} />;
}
