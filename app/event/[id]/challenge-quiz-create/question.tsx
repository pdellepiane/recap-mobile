import { EventChallengeQuizCreateQuestionScreenPage } from '@/src/features/event-detail/presentation/screens/EventChallengeQuizCreateQuestionScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengeQuizCreateQuestionRoute() {
  const { id, questionId, challengeId } = useLocalSearchParams<{
    id?: string | string[];
    questionId?: string | string[];
    challengeId?: string | string[];
  }>();
  const eventId = firstString(id) ?? '';
  const qid = firstString(questionId) ?? '';
  const remoteChallengeId = firstString(challengeId);
  return (
    <EventChallengeQuizCreateQuestionScreenPage
      eventId={eventId}
      questionId={qid}
      remoteChallengeId={remoteChallengeId}
    />
  );
}
