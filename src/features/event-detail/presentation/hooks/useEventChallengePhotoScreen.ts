import { getEventChallenges } from '../../data/eventChallenges';
import { useTranslation } from '@/src/i18n';
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
  const { goToEventChallengePhotoCamera } = useCoordinator();
  const { t } = useTranslation();

  const { title, kicker, resolvedChallengeNumber, isAlreadyAnswered } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber ?? 2;
    return {
      title: challenge?.title ?? t('challenges.photoIntroDefault'),
      kicker: t('challenges.challengeNumberLabel', { n }),
      resolvedChallengeNumber: n,
      isAlreadyAnswered: challenge?.remoteCompletedPoints !== undefined,
    };
  }, [eventId, challengeId, challengeNumber, t]);

  const handleOpenCamera = () => {
    if (isAlreadyAnswered) {
      return;
    }
    goToEventChallengePhotoCamera(eventId, challengeId, resolvedChallengeNumber);
  };

  return {
    kicker,
    title,
    handleOpenCamera,
    isAlreadyAnswered,
  };
}
