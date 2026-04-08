import { takeChallengePhotoCompletionPreview } from '../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../data/eventChallenges';
import { recordEventChallengeCompletion } from '../data/eventChallengesCompletionStore';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber: number;
  points: number;
};

/**
 * Handles completion-screen derived content and CTA navigation.
 */
export function useEventChallengePhotoCompletedScreen({
  eventId,
  challengeId,
  challengeNumber,
  points,
}: Params) {
  const insets = useSafeAreaInsets();
  const { goToEventChallengesCompleted, goToEventDetailTabWithCompletedChallenge } =
    useCoordinator();
  const { width: winW } = Dimensions.get('window');
  const [thumbUri] = useState(() => takeChallengePhotoCompletionPreview());

  const { summaryLine, displayNumber } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber;
    const raw = challenge?.title ?? '';
    return {
      displayNumber: n,
      summaryLine: raw.replace(/\n+/g, ' ').trim() || 'Challenge de foto completado.',
    };
  }, [eventId, challengeId, challengeNumber]);

  const closeToEvent = () => {
    recordEventChallengeCompletion(eventId, challengeId, points);
    goToEventChallengesCompleted(eventId, challengeId, points);
  };

  const goToRanking = () => {
    recordEventChallengeCompletion(eventId, challengeId, points);
    goToEventDetailTabWithCompletedChallenge(eventId, 'ranking', challengeId, points);
  };

  const circleTop = Math.max(12, insets.top + 8);

  return {
    winW,
    thumbUri,
    summaryLine,
    displayNumber,
    closeToEvent,
    goToRanking,
    circleTop,
  };
}
