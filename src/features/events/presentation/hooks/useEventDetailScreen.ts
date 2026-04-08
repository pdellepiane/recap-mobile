import { getEventAlbum } from '../data/eventAlbum';
import type { EventChallenge } from '../data/eventChallenges';
import { getEventChallenges } from '../data/eventChallenges';
import {
  getEventChallengesCompletionSnapshot,
  recordEventChallengeCompletion,
} from '../data/eventChallengesCompletionStore';
import {
  displayDescriptionForEvent,
  displayTitleForEvent,
  getEventDetailExtras,
  getMapsSearchQueryForEvent,
} from '../data/eventDetailExtras';
import { getEventRanking } from '../data/eventRanking';
import { useEventDetail } from './useEventDetail';
import { useLaunchDeviceCamera } from './useLaunchDeviceCamera';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';

export enum EventDetailTab {
  Overview = 'detalle',
  Challenges = 'challenges',
  Ranking = 'ranking',
  Album = 'album',
}

type Params = {
  eventId: string;
  initialTab?: EventDetailTab;
  completedChallengeId?: string;
  completedPoints?: number;
};

/**
 * Orchestrates event-detail screen state and handlers (tabs, back behavior, challenges completion and navigation).
 */
export function useEventDetailScreen({
  eventId,
  initialTab,
  completedChallengeId,
  completedPoints,
}: Params) {
  const {
    goBack,
    goToHome,
    goToEventMap,
    goToEventStories,
    goToEventChallengeQuiz,
    goToEventChallengePhoto,
  } = useCoordinator();
  const { event, isLoading } = useEventDetail(eventId);
  const { takePhoto } = useLaunchDeviceCamera();
  const [activeTab, setActiveTab] = useState<EventDetailTab>(initialTab ?? EventDetailTab.Overview);
  const [completedByChallengeId, setCompletedByChallengeId] = useState<Record<string, number>>({});

  useEffect(() => {
    setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
  }, [eventId]);

  useEffect(() => {
    if (activeTab !== EventDetailTab.Challenges) {
      return;
    }
    setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
  }, [activeTab, eventId]);

  useEffect(() => {
    if (!completedChallengeId) {
      return;
    }
    let pts: number;
    if (typeof completedPoints === 'number' && Number.isFinite(completedPoints)) {
      pts = completedPoints;
    } else {
      const challenges = getEventChallenges(eventId);
      const r = challenges.find((x) => x.id === completedChallengeId);
      pts = r?.points ?? 10;
    }
    recordEventChallengeCompletion(eventId, completedChallengeId, pts);
    setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
  }, [eventId, completedChallengeId, completedPoints]);

  useEffect(() => {
    setActiveTab(initialTab ?? EventDetailTab.Overview);
  }, [initialTab, eventId]);

  const hasAnyCompletionForCurrentEvent = useMemo(() => {
    const snapshot = getEventChallengesCompletionSnapshot(eventId);
    const ids = new Set(getEventChallenges(eventId).map((r) => r.id));
    return Object.keys(snapshot).some((id) => ids.has(id));
  }, [eventId, completedByChallengeId]);

  const handleDetailBack = useCallback(() => {
    if (completedChallengeId || hasAnyCompletionForCurrentEvent) {
      goToHome();
      return;
    }
    goBack();
  }, [completedChallengeId, hasAnyCompletionForCurrentEvent, goBack, goToHome]);

  useEffect(() => {
    if (!completedChallengeId && !hasAnyCompletionForCurrentEvent) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goToHome();
      return true;
    });
    return () => sub.remove();
  }, [completedChallengeId, hasAnyCompletionForCurrentEvent, goToHome]);

  const onFabCameraPress = useCallback(() => {
    void takePhoto();
  }, [takePhoto]);

  const onChallengePress = useCallback(
    async (challenge: EventChallenge) => {
      if (!event) {
        return;
      }
      if (challenge.kind === 'quiz') {
        goToEventChallengeQuiz(event.id, challenge.id, challenge.number);
        return;
      }
      goToEventChallengePhoto(event.id, challenge.id, challenge.number);
    },
    [event, goToEventChallengeQuiz, goToEventChallengePhoto],
  );

  const extras = event ? getEventDetailExtras(event.id) : null;
  const countdownEndsAt = useMemo(
    () => new Date(Date.now() + (3 * 3600 + 23 * 60 + 23) * 1000),
    [],
  );

  const heroSource = useMemo(() => {
    if (!event) {
      return undefined;
    }
    if (extras?.heroImage) {
      return extras.heroImage;
    }
    if (event.coverImageUrl) {
      return { uri: event.coverImageUrl } as const;
    }
    return undefined;
  }, [event, extras]);

  const title = event ? displayTitleForEvent(event) : '';
  const description = event ? displayDescriptionForEvent(event) : '';
  const mapsQuery = event ? getMapsSearchQueryForEvent(event.id, event) : '';
  const venueLine1 = event?.location ?? '';
  const venueLine2 = extras?.venueArea ?? '';
  const challenges = event ? getEventChallenges(event.id) : [];
  const rankingRows = event ? getEventRanking(event.id) : [];
  const albumPhotos = event ? getEventAlbum(event.id) : [];

  const handleProfileAvatarPress = useMemo(() => {
    if (!event || event.id !== 'evt-live-2') {
      return undefined;
    }
    return () => goToEventStories(event.id);
  }, [event, goToEventStories]);

  const handleOpenMap = useCallback(() => {
    if (event && mapsQuery) {
      goToEventMap(event.id, mapsQuery);
    }
  }, [event, mapsQuery, goToEventMap]);

  return {
    event,
    isLoading,
    activeTab,
    setActiveTab,
    completedByChallengeId,
    handleDetailBack,
    onFabCameraPress,
    onChallengePress,
    extras,
    countdownEndsAt,
    heroSource,
    title,
    description,
    mapsQuery,
    venueLine1,
    venueLine2,
    challenges,
    rankingRows,
    albumPhotos,
    handleProfileAvatarPress,
    handleOpenMap,
  };
}
