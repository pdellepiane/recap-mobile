import type { AlbumPhoto } from '../../data/eventAlbum';
import { EventChallengeKind, getEventChallenges, type EventChallenge } from '../../data/eventChallenges';
import {
  getEventChallengesCompletionSnapshot,
  recordEventChallengeCompletion,
} from '../../data/eventChallengesCompletionStore';
import { takePendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import {
  displayDescriptionForEvent,
  displayTitleForEvent,
  getEventDetailExtras,
  getMapsSearchQueryForEvent,
} from '../../data/eventDetailExtras';
import type { RankingRow } from '../../data/eventRanking';
import { getEventStoriesBundle } from '../../data/eventStories';
import { useEventDetail } from './useEventDetail';
import { images } from '@/src/assets/images';
import { eventRepository } from '@/src/core/di/container';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { isEventHostedFromHomeFeed } from '@/src/features/events/data/homeEventCache';
import {
  canHostEditChallengesUntilOneMinuteBefore,
  isEventCalendarDayStrictlyAfterToday,
  isEventCalendarDayToday,
  isEventCalendarDayTodayOrPast,
  isWithinEventReactionsWindow,
} from '@/src/features/home/presentation/components/utils/eventCalendar';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, type ImageSourcePropType } from 'react-native';
import { useInvalidateRemoteImageCache } from '@/src/ui';

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

/**
 * Antes del día del evento (invitado): Detalle + Álbum — sin ranking ni desafíos.
 * Producto: invitado ve ranking y desafíos desde el día del evento (24h) en adelante.
 */
const GUEST_PRE_EVENT_DAY_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Album,
];

/**
 * Antes del día del evento (anfitrión): Detalle + Desafíos + Álbum — desafíos visibles siempre;
 * ranking solo desde el día del evento.
 */
const HOST_PRE_EVENT_DAY_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Challenges,
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
    goToEventDetailCamera,
    goToEventChallengeQuiz,
    goToEventChallengePhoto,
  } = useCoordinator();
  const { t } = useTranslation();
  const invalidateRemoteImageCache = useInvalidateRemoteImageCache();
  const { session } = useAuth();
  const { event, isLoading, reload: reloadEventDetail } = useEventDetail(eventId);
  const [isDetailRefreshing, setIsDetailRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<EventDetailTab>(initialTab ?? EventDetailTab.Overview);
  const [completedByChallengeId, setCompletedByChallengeId] = useState<Record<string, number>>({});
  const [rankingRows, setRankingRows] = useState<RankingRow[]>([]);
  const [challenges, setChallenges] = useState<EventChallenge[]>([]);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  /** Previous tab — used to refetch detalle/álbum only when switching into those tabs (not on first mount). */
  const prevTabRef = useRef<EventDetailTab | null>(null);

  /**
   * Retos y ranking: anfitrión siempre; invitado solo el día del evento (calendario local) o después.
   * Invitado sin fecha válida: no cargar desde API.
   */
  const guestEventDayOrPastTabBlocked = useMemo(() => {
    if (!event?.id) {
      return false;
    }
    if (isEventHostedFromHomeFeed(event.id)) {
      return false;
    }
    const trimmed = event.date?.trim() ?? '';
    const hasValidDate = trimmed.length > 0 && !Number.isNaN(Date.parse(trimmed));
    if (!hasValidDate) {
      return true;
    }
    return !isEventCalendarDayTodayOrPast(trimmed);
  }, [event?.id, event?.date]);

  /**
   * GET /api/events/:id/challenges — solo al entrar en Retos (anfitrión siempre; invitado: día del evento o después).
   */
  useEffect(() => {
    if (activeTab !== EventDetailTab.Challenges || !event?.id) {
      return;
    }
    if (guestEventDayOrPastTabBlocked) {
      setChallenges([]);
      return;
    }
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
  }, [activeTab, event?.id, eventId, guestEventDayOrPastTabBlocked]);

  /**
   * GET /api/events/:id — al entrar en Detalle o Álbum desde otra pestaña (carga inicial la hace {@link useEventDetail}).
   */
  useEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = activeTab;

    if (!eventId) {
      return;
    }
    const entersDetailOrAlbum =
      (activeTab === EventDetailTab.Overview || activeTab === EventDetailTab.Album) &&
      prev !== null &&
      prev !== activeTab;
    if (entersDetailOrAlbum) {
      void reloadEventDetail({ silent: true });
    }
  }, [activeTab, eventId, reloadEventDetail]);

  useEffect(() => {
    setAlbumPhotos([]);
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      if (!eventId) {
        return undefined;
      }
      const pending = takePendingEventAlbumPhoto(eventId);
      if (!pending?.uri) {
        return undefined;
      }
      const width = pending.width && pending.width > 0 ? pending.width : 1;
      const height = pending.height && pending.height > 0 ? pending.height : 1;
      const author = session?.user.name?.trim() || t('eventDetail.cameraAuthorFallback');
      setAlbumPhotos((current) => [
        {
          id: `local-${eventId}-${pending.uri}`,
          uri: pending.uri,
          aspectRatio: width / height,
          authorShort: author,
          likes: 0,
        },
        ...current.filter((photo) => photo.uri !== pending.uri),
      ]);
      setActiveTab(EventDetailTab.Album);
      return undefined;
    }, [eventId, session?.user.name, t]),
  );

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
    const isHost = isEventHostedFromHomeFeed(event.id);
    const beforeEventCalendarDay = isEventCalendarDayStrictlyAfterToday(event.date);
    if (!beforeEventCalendarDay) {
      return FULL_DETAIL_TABS;
    }
    return isHost ? HOST_PRE_EVENT_DAY_TABS : GUEST_PRE_EVENT_DAY_TABS;
  }, [event]);

  /** Anfitrión: crear/editar desafíos hasta 1 min antes del inicio (para UI futura). */
  const canHostEditChallenges = useMemo(() => {
    if (!event?.date) {
      return false;
    }
    if (!isEventHostedFromHomeFeed(event.id)) {
      return false;
    }
    return canHostEditChallengesUntilOneMinuteBefore(event.date);
  }, [event?.date, event?.id]);

  useEffect(() => {
    if (!detailVisibleTabs.includes(activeTab)) {
      setActiveTab(EventDetailTab.Overview);
    }
  }, [detailVisibleTabs, activeTab]);

  const hasAnyCompletionForCurrentEvent = useMemo(() => {
    const snapshot = getEventChallengesCompletionSnapshot(eventId);
    const merged = { ...snapshot, ...completedByChallengeId };
    const ids = new Set(challenges.map((r) => r.id));
    return Object.keys(merged).some((id) => ids.has(id));
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
    if (!eventId) {
      return;
    }
    const eventTitle = event ? displayTitleForEvent(event) : '';
    goToEventDetailCamera(eventId, eventTitle);
  }, [event, eventId, goToEventDetailCamera]);

  const onChallengePress = useCallback(
    async (challenge: EventChallenge) => {
      if (!event) {
        return;
      }
      const isHost = isEventHostedFromHomeFeed(event.id);
      if (!isHost) {
        const trimmed = event.date?.trim() ?? '';
        const hasValidDate = trimmed.length > 0 && !Number.isNaN(Date.parse(trimmed));
        if (!hasValidDate || !isEventCalendarDayTodayOrPast(trimmed)) {
          return;
        }
      }
      if (challenge.kind === EventChallengeKind.Quiz) {
        goToEventChallengeQuiz(event.id, challenge.id, challenge.number);
        return;
      }
      goToEventChallengePhoto(event.id, challenge.id, challenge.number);
    },
    [event, goToEventChallengeQuiz, goToEventChallengePhoto],
  );

  const extras = event ? getEventDetailExtras(event.id) : null;

  /**
   * Como anfitrión (evento en “Mis eventos”): mismo texto e iniciales que la sesión.
   * Como invitado: API / extras.
   */
  const hostsLine = useMemo(() => {
    if (event && isEventHostedFromHomeFeed(event.id)) {
      const me = session?.user.name?.trim();
      if (me) {
        return me;
      }
    }
    const fromApi = event?.hostsLine?.trim();
    if (fromApi) {
      return fromApi;
    }
    const fromExtras = extras?.hostsLine?.trim();
    if (fromExtras) {
      return fromExtras;
    }
    return t('eventDetail.hostsFallback');
  }, [event, extras?.hostsLine, session?.user.name, t]);

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

  const completedByChallengeIdForUi = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (typeof c.remoteCompletedPoints === 'number') {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    return { ...fromApi, ...completedByChallengeId };
  }, [challenges, completedByChallengeId]);

  /**
   * GET /api/events/:id/ranking — solo al entrar en Ranking (anfitrión siempre; invitado: día del evento o después).
   */
  useEffect(() => {
    if (activeTab !== EventDetailTab.Ranking || !event?.id) {
      return;
    }
    if (guestEventDayOrPastTabBlocked) {
      setRankingRows([]);
      return;
    }
    const id = event.id;
    let cancelled = false;
    void (async () => {
      const remote = await eventRepository.fetchEventRankingRemote(id);
      if (cancelled) {
        return;
      }
      setRankingRows(remote ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, event?.id, guestEventDayOrPastTabBlocked]);

  /**
   * GET /api/events/:id/media — al entrar en Álbum.
   */
  useEffect(() => {
    if (activeTab !== EventDetailTab.Album || !event?.id) {
      return;
    }
    const id = event.id;
    let cancelled = false;
    void (async () => {
      const photos = await eventRepository.fetchEventMedia(id);
      if (cancelled) {
        return;
      }
      setAlbumPhotos(photos);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, event?.id]);

  const onDetailPullRefresh = useCallback(async () => {
    setIsDetailRefreshing(true);
    try {
      await invalidateRemoteImageCache();
      await reloadEventDetail({ silent: true });
      if (eventId) {
        const nextAlbum = await eventRepository.fetchEventMedia(eventId);
        setAlbumPhotos(nextAlbum);
      }
      if (!eventId || !event) {
        return;
      }
      const trimmed = event.date?.trim() ?? '';
      const hasValidDate = trimmed.length > 0 && !Number.isNaN(Date.parse(trimmed));
      const isHost = isEventHostedFromHomeFeed(eventId);
      const guestDayOrPastBlocked =
        !isHost && (!hasValidDate || !isEventCalendarDayTodayOrPast(trimmed));
      if (!guestDayOrPastBlocked) {
        const nextChallenges = await eventRepository.fetchEventChallenges(eventId);
        setChallenges(nextChallenges);
      } else {
        setChallenges([]);
      }
      if (!guestDayOrPastBlocked) {
        setRankingRows([]);
        const remote = await eventRepository.fetchEventRankingRemote(eventId);
        setRankingRows(remote ?? []);
      } else {
        setRankingRows([]);
      }
    } finally {
      setIsDetailRefreshing(false);
    }
  }, [invalidateRemoteImageCache, reloadEventDetail, eventId, event]);

  /** Center avatar in the reaction row: story author when statuses exist, otherwise event cover. */
  const liveRowCenterImage = useMemo((): ImageSourcePropType => {
    if (!event) {
      return images.tabs.profileInactive;
    }
    const bundle = getEventStoriesBundle(event.id);
    if (bundle) {
      return { uri: bundle.authorAvatarUrl };
    }
    return heroSource ?? images.tabs.profileInactive;
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

  const isEventHost = Boolean(event && isEventHostedFromHomeFeed(event.id));

  /** Re-evaluate 48h reaction window while the screen is open (boundaries are time-based). */
  const [reactionWindowTick, setReactionWindowTick] = useState(0);
  useEffect(() => {
    const trimmed = event?.date?.trim() ?? '';
    if (!trimmed || Number.isNaN(Date.parse(trimmed))) {
      return;
    }
    const id = setInterval(() => setReactionWindowTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [event?.date]);

  const showFloatingReactions = useMemo(() => {
    void reactionWindowTick;
    const trimmed = event?.date?.trim() ?? '';
    if (!trimmed) {
      return false;
    }
    return isWithinEventReactionsWindow(trimmed);
  }, [event?.date, reactionWindowTick]);

  return {
    event,
    isEventHost,
    showFloatingReactions,
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
    canHostEditChallenges,
  };
}
