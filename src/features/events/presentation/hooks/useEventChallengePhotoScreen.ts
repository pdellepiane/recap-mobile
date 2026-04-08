import { getEventChallenges } from '../data/eventChallenges';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useMemo } from 'react';

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Builds screen copy and CTA handler for the challenge-photo intro screen.
 */
export function useEventChallengePhotoScreen({ eventId, challengeId, challengeNumber }: Params) {
  const { goBack, goToEventChallengePhotoCamera } = useCoordinator();

  const { title, numberLabel, resolvedChallengeNumber } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber ?? 2;
    return {
      title: challenge?.title ?? 'Tómate una foto\npara el\nevento.',
      numberLabel: `Challenge ${String(n)}`,
      resolvedChallengeNumber: n,
    };
  }, [eventId, challengeId, challengeNumber]);

  const instructionParagraphs = useMemo(
    () =>
      title
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [title],
  );

  const handleOpenCamera = () =>
    goToEventChallengePhotoCamera(eventId, challengeId, resolvedChallengeNumber);

  return {
    goBack,
    numberLabel,
    instructionParagraphs,
    handleOpenCamera,
  };
}
