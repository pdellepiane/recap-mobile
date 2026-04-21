import {
  isEventCalendarDayStrictlyAfterToday,
  isEventCalendarDayToday,
} from '../components/utils/eventCalendar';
import { images } from '@/src/assets/images';
import { eventRepository } from '@/src/core/di/container';
import { getEventAlbum } from '@/src/features/event-detail/data/eventAlbum';
import type { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import { getEventChallenges } from '@/src/features/event-detail/data/eventChallenges';
import {
  getEventChallengesCompletionSnapshot,
  recordEventChallengeCompletion,
} from '@/src/features/event-detail/data/eventChallengesCompletionStore';
import {
  displayDescriptionForEvent,
  displayTitleForEvent,
  getEventDetailExtras,
  getMapsSearchQueryForEvent,
} from '@/src/features/event-detail/data/eventDetailExtras';
import type { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import { getLocalRankingSnapshot } from '@/src/features/event-detail/data/eventRanking';
import { getEventStoriesBundle } from '@/src/features/event-detail/data/eventStories';
import { useEventDetail } from '@/src/features/event-detail/presentation/hooks/useEventDetail';
import { useLaunchDeviceCamera } from '@/src/features/event-detail/presentation/hooks/useLaunchDeviceCamera';
import { isEventHostedFromHomeFeed } from '@/src/features/home/data/homeEventCache';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, type ImageSourcePropType } from 'react-native';

export enum EventDetailTab {
  Overview = 'detalle',
  Challenges = 'challenges',
  Ranking = 'ranking',
  Album = 'album',
}

const FULL_DETAIL_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Challenges,
  EventDetailTab.Ranking,
  EventDetailTab.Album,
];

/** Hosted “Mis eventos” whose calendar day is strictly after today: Detalle + Álbum only. */
const HOST_FUTURE_DAY_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Album,
];

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
  const { event, isLoading, reload: reloadEventDetail } = useEventDetail(eventId);
  const [isDetailRefreshing, setIsDetailRefreshing] = useState(false);
  const { takePhoto } = useLaunchDeviceCamera();
  const [activeTab, setActiveTab] = useState<EventDetailTab>(initialTab ?? EventDetailTab.Overview);
  const [completedByChallengeId, setCompletedByChallengeId] = useState<Record<string, number>>({});
  const [rankingRows, setRankingRows] = useState<RankingRow[]>([]);
  const [challenges, setChallenges] = useState<EventChallenge[]>(() => getEventChallenges(eventId));

  useEffect(() => {
    setChallenges(getEventChallenges(eventId));
    let cancelled = false;
    void (async () => {
      const rows = await eventRepository.fetchEventChallenges(eventId);
      if (cancelled) {
        return;
      }
      setChallenges(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

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
      const r = challenges.find((x) => x.id === completedChallengeId);
      pts = r?.points ?? 10;
    }
    recordEventChallengeCompletion(eventId, completedChallengeId, pts);
    setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
  }, [eventId, completedChallengeId, completedPoints, challenges]);

  useEffect(() => {
    setActiveTab(initialTab ?? EventDetailTab.Overview);
  }, [initialTab, eventId]);

  const detailVisibleTabs = useMemo((): readonly EventDetailTab[] => {
    if (!event) {
      return FULL_DETAIL_TABS;
    }
    if (!isEventHostedFromHomeFeed(event.id)) {
      return FULL_DETAIL_TABS;
    }
    if (isEventCalendarDayStrictlyAfterToday(event.date)) {
      return HOST_FUTURE_DAY_TABS;
    }
    return FULL_DETAIL_TABS;
  }, [event]);

  useEffect(() => {
    if (!detailVisibleTabs.includes(activeTab)) {
      setActiveTab(EventDetailTab.Overview);
    }
  }, [detailVisibleTabs, activeTab]);

  const hasAnyCompletionForCurrentEvent = useMemo(() => {
    const snapshot = getEventChallengesCompletionSnapshot(eventId);
    const ids = new Set(challenges.map((r) => r.id));
    return Object.keys(snapshot).some((id) => ids.has(id));
  }, [eventId, challenges, completedByChallengeId]);

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

  const hostsLine = useMemo(() => {
    const fromApi = event?.hostsLine?.trim();
    if (fromApi) {
      return fromApi;
    }
    const fromExtras = extras?.hostsLine?.trim();
    if (fromExtras) {
      return fromExtras;
    }
    return 'Organizadores';
  }, [event?.hostsLine, extras?.hostsLine]);

  /** Target instant for the detail countdown — same as {@link Event.date} (API `datetime`). */
  const countdownEndsAt = useMemo(() => {
    if (!event?.date) {
      return new Date();
    }
    const ms = Date.parse(event.date);
    if (Number.isNaN(ms)) {
      return new Date();
    }
    return new Date(ms);
  }, [event?.date]);

  /** Hide countdown on the event’s calendar day (and when {@link EventDetailExtras.hideCountdownInDetail}). */
  const showDetailCountdown = useMemo(() => {
    if (extras?.hideCountdownInDetail) {
      return false;
    }
    if (event?.date && isEventCalendarDayToday(event.date)) {
      return false;
    }
    return true;
  }, [event?.date, extras?.hideCountdownInDetail]);

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
  const albumPhotos = event ? getEventAlbum(event.id) : [];

  const completedByChallengeIdForUi = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (typeof c.remoteCompletedPoints === 'number') {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    return { ...fromApi, ...completedByChallengeId };
  }, [challenges, completedByChallengeId]);

  useEffect(() => {
    if (!event?.id) {
      setRankingRows([]);
      return;
    }
    const id = event.id;
    setRankingRows(getLocalRankingSnapshot(id));
    let cancelled = false;
    void (async () => {
      const remote = await eventRepository.fetchEventRankingRemote(id);
      if (cancelled) {
        return;
      }
      if (remote && remote.length > 0) {
        setRankingRows(remote);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event?.id]);

  const onDetailPullRefresh = useCallback(async () => {
    setIsDetailRefreshing(true);
    try {
      await reloadEventDetail({ silent: true });
      if (eventId) {
        const nextChallenges = await eventRepository.fetchEventChallenges(eventId);
        setChallenges(nextChallenges);
        setRankingRows(getLocalRankingSnapshot(eventId));
        const remote = await eventRepository.fetchEventRankingRemote(eventId);
        if (remote && remote.length > 0) {
          setRankingRows(remote);
        }
      }
    } finally {
      setIsDetailRefreshing(false);
    }
  }, [reloadEventDetail, eventId]);

  /** Center avatar in the reaction row: story author when statuses exist, otherwise event cover. */
  const liveRowCenterImage = useMemo((): ImageSourcePropType => {
    if (!event) {
      return images.eventDetail.avatarMariel;
    }
    const bundle = getEventStoriesBundle(event.id);
    if (bundle) {
      return { uri: bundle.authorAvatarUrl };
    }
    return heroSource ?? images.eventDetail.avatarMariel;
  }, [event, heroSource]);

  const handleProfileAvatarPress = useCallback(() => {
    if (getEventStoriesBundle(eventId) == null) {
      return;
    }
    goToEventStories(eventId);
  }, [eventId, goToEventStories]);

  const handleOpenMap = useCallback(() => {
    if (event && mapsQuery) {
      goToEventMap(event.id, mapsQuery);
    }
  }, [event, mapsQuery, goToEventMap]);

  return {
    event,
    isLoading,
    isDetailRefreshing,
    onDetailPullRefresh,
    activeTab,
    setActiveTab,
    detailVisibleTabs,
    completedByChallengeId: completedByChallengeIdForUi,
    handleDetailBack,
    onFabCameraPress,
    onChallengePress,
    extras,
    countdownEndsAt,
    showDetailCountdown,
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
    liveRowCenterImage,
    handleOpenMap,
    hostsLine,
  };
}
