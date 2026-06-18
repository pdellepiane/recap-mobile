import { EventDetailTab } from '../../../../navigation/eventDetailTabs';
import { takeChallengePhotoCompletionPreview } from '../../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../../data/eventChallenges';
import { recordEventChallengeCompletion } from '../../data/eventChallengesCompletionStore';
import { emitEventChallengesListRefresh } from '../../data/eventChallengesListRefresh';
import { emitEventDetailTabSwitch } from '../../data/eventDetailTabSwitch';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';

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
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { width: winW } = useWindowDimensions();
  const [thumbUri] = useState(() => takeChallengePhotoCompletionPreview());

  const { summaryLine, displayNumber } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber;
    const raw = challenge?.title ?? '';
    return {
      displayNumber: n,
      summaryLine: raw.replace(/\n+/g, ' ').trim() || t('challenges.photoCompletedSummaryFallback'),
    };
  }, [eventId, challengeId, challengeNumber, t]);

  const onClose = () => {
    recordEventChallengeCompletion(eventId, challengeId, points);
    emitEventChallengesListRefresh(eventId);
    goBack();
    goBack();
  };

  const goToRanking = () => {
    recordEventChallengeCompletion(eventId, challengeId, points);
    emitEventChallengesListRefresh(eventId);
    emitEventDetailTabSwitch(eventId, EventDetailTab.Ranking);
    goBack();
    goBack();
  };

  return {
    winW,
    thumbUri,
    summaryLine,
    displayNumber,
    onClose,
    goToRanking,
  };
}
