import {
  countdownEndsAtForEvent,
  eventGuestListGoingRows,
  eventGuestsGoing,
  eventParticipantNamesLine,
  guestsPendingCountFromEvent,
  hostsLineForDetailView,
  organizerGuestListCounts,
} from '../../data/eventDetailDerived';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { EventDetailTab } from './eventDetailTabs';
import { useEventDetailAlbum } from './useEventDetailAlbum';
import { useEventDetailChallenges } from './useEventDetailChallenges';
import { useEventDetailRanking } from './useEventDetailRanking';
import { useEventDetailShare } from './useEventDetailShare';
import { useEventDetailTabsAccess } from './useEventDetailTabsAccess';
import analytics from '@/src/core/analytics';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import { isDuringEventStartPlus24hWindow } from '@/src/features/home/presentation/components/utils/eventCalendar';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import {
  showShortUserMessage,
  useInvalidateRemoteImageCache,
  type SpawnFloatingReaction,
} from '@/src/ui';
import { useFocusEffect } from '@react-navigation/native';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

export { EventDetailTab } from './eventDetailTabs';

type Params = {
  eventId: string;
  initialTab?: EventDetailTab;
  completedChallengeId?: string;
  completedPoints?: number;
  openChallengeId?: string;
  openAlbumPhotoId?: string;
};

export type EventDetailScreenData = {
  event: Event | null;
  isLoading: boolean;
  isDetailRefreshing: boolean;
  isOrganizer: boolean;
  canHostEditChallenges: boolean;
  activeTab: EventDetailTab;
  detailVisibleTabs: readonly EventDetailTab[];
  completedByChallengeId: Record<string, number>;
  challenges: ReturnType<typeof useEventDetailChallenges>['challenges'];
  isChallengesLoaded: ReturnType<typeof useEventDetailChallenges>['isChallengesLoaded'];
  rankingRows: ReturnType<typeof useEventDetailRanking>['rankingRows'];
  albumPhotos: ReturnType<typeof useEventDetailAlbum>['albumPhotos'];
  arePhotosLoaded: ReturnType<typeof useEventDetailAlbum>['arePhotosLoaded'];
  albumHasMore: ReturnType<typeof useEventDetailAlbum>['albumHasMore'];
  isLoadingMoreAlbum: ReturnType<typeof useEventDetailAlbum>['isLoadingMoreAlbum'];
  countdownEndsAt: Date;
  goingGuests: ReturnType<typeof eventGuestListGoingRows>;
  guestsAttendingCount: number;
  guestsPendingCount: number | undefined;
  participantNamesLine: string;
  isPublicGuestListEnabled: boolean;
  isShareSheetOpen: boolean;
  isCreateChallengeSheetOpen: boolean;
  /** Retos tab dot from GET …/challenges/pending during ventana en vivo (inicio → +24h). */
  showChallengesPendingDot: boolean;
  /** Overview hosts line (anfitrión / invitado copy from `eventDetailDerived`). */
  hostsLine: string;
  organizerGuestList: { listConfirmed: number; listTotalInvited: number };
};

export type EventDetailScreenHandlers = {
  setActiveTab: (tab: EventDetailTab) => void;
  setIsPublicGuestListEnabled: Dispatch<SetStateAction<boolean>>;
  onBackPress: () => void;
  onPullRefresh: () => Promise<void>;
  /** Stable wrapper for RefreshControl (`void` pull refresh). */
  onDetailRefresh: () => void;
  onFabCameraPress: () => void;
  onChallengePress: ReturnType<typeof useEventDetailChallenges>['onChallengePress'];
  onProfileAvatarPress: () => void;
  onParticipantsModalOpen: () => void;
  onSharePress: () => void;
  onShareSheetClose: () => void;
  onShareConfirm: () => Promise<void>;
  /** Stable wrapper for share sheet confirm. */
  onShareConfirmPress: () => void;
  onCreateChallengeSheetOpen: () => void;
  onCreateChallengeSheetClose: () => void;
  onCreateQuizChallengeSelect: () => void;
  onCreatePhotoChallengeSelect: () => void;
  onAlbumPhotoLike: (photoId: string) => void;
  onAlbumPhotoPress: (photoId: string) => void;
  onAlbumLoadMore: () => void;
  onLiveReaction: (
    spawnAt: SpawnFloatingReaction,
    payload: EventDetailReactionPressPayload,
  ) => Promise<void>;
};

/**
 * Orchestrates event-detail screen state and handlers (back, navigation, modals).
 * Tabs, visibility, and guest tab access: {@link useEventDetailTabsAccess}.
 * Per-tab data: challenges, ranking, album hooks.
 * Wire → domain: `eventDomainMap` (`mapEventDetailDataToDomain`, `mapHomeEventApiItemToDomain`); calendar/reaction helpers in `eventDetailDerived.ts`.
 *
 * Return shape: **`data`** for render, **`handlers`** for `on*` / `set*` wiring (effects stay inside the hook only).
 */
export function useEventDetailScreen({
  eventId,
  initialTab,
  completedChallengeId,
  completedPoints,
  openChallengeId,
  openAlbumPhotoId,
}: Params): { data: EventDetailScreenData; handlers: EventDetailScreenHandlers } {
  // --- Setup
  const {
    goBack,
    goToEventStories,
    goToEventDetailCamera,
    goToEventChallengeQuizCreate,
    goToEventChallengePhotoCreate,
    goToEventDetailParticipants,
  } = useCoordinator();
  const { t } = useTranslation();
  const invalidateRemoteImageCache = useInvalidateRemoteImageCache();
  const { session } = useAuth();
  const {
    event,
    isLoading,
    reload: reloadEventDetail,
    isPublicGuestListEnabled,
    setIsPublicGuestListEnabled,
  } = useEventDetailRoute();

  // --- Local UI state
  const [isDetailRefreshing, setIsDetailRefreshing] = useState(false);
  const [isCreateChallengeSheetOpen, setIsCreateChallengeSheetOpen] = useState(false);
  const [challengesPendingDot, setChallengesPendingDot] = useState(false);

  const { isShareSheetOpen, handlers: shareHandlers } = useEventDetailShare({ eventId, event });

  // --- Tabs & per-tab data hooks
  const {
    activeTab,
    setActiveTab,
    detailVisibleTabs,
    guestEventDayOrPastTabBlocked,
    isOrganizer,
    canHostEditChallenges,
  } = useEventDetailTabsAccess({
    eventId,
    event,
    initialTab,
    reloadEventDetail,
  });

  const {
    challenges,
    isChallengesLoaded,
    completedByChallengeIdForUi,
    refetchChallenges,
    handlers: challengeHandlers,
  } = useEventDetailChallenges({
    eventId,
    event,
    activeTab,
    guestEventDayOrPastTabBlocked,
    completedChallengeId,
    completedPoints,
    isOrganizer,
    openChallengeId,
  });

  const { rankingRows, refetchRanking } = useEventDetailRanking({
    eventId,
    event,
    activeTab,
    guestEventDayOrPastTabBlocked,
  });

  const {
    albumPhotos,
    arePhotosLoaded,
    albumHasMore,
    isLoadingMoreAlbum,
    refetchAlbum,
    handlers: albumHandlers,
  } = useEventDetailAlbum({
    eventId,
    event,
    activeTab,
    authorName: session?.user.name,
    t,
    setActiveTab,
    openAlbumPhotoId,
  });

  const pendingDotGenerationRef = useRef(0);
  const {
    beginRequest: beginPendingRequest,
    endRequest: endPendingRequest,
    abortAll: abortPending,
  } = useAbortController();

  const refreshChallengesPendingDot = useCallback(async () => {
    const generation = ++pendingDotGenerationRef.current;
    const controller = beginPendingRequest();
    const date = event?.date?.trim();
    if (!eventId || !date || Number.isNaN(Date.parse(date))) {
      if (generation === pendingDotGenerationRef.current) {
        setChallengesPendingDot(false);
      }
      endPendingRequest(controller);
      return;
    }
    if (!isDuringEventStartPlus24hWindow(date, new Date())) {
      if (generation === pendingDotGenerationRef.current) {
        setChallengesPendingDot(false);
      }
      endPendingRequest(controller);
      return;
    }
    try {
      const hasPending = await eventRepository.fetchEventChallengesPending(eventId, {
        signal: controller.signal,
      });
      if (generation !== pendingDotGenerationRef.current) {
        return;
      }
      setChallengesPendingDot(hasPending);
    } catch (e) {
      if (isAbortError(e)) {
        return;
      }
      if (generation === pendingDotGenerationRef.current) {
        setChallengesPendingDot(false);
      }
    } finally {
      endPendingRequest(controller);
    }
  }, [beginPendingRequest, endPendingRequest, event?.date, eventId]);

  useFocusEffect(
    useCallback(() => {
      void refreshChallengesPendingDot();
    }, [refreshChallengesPendingDot]),
  );

  useEffect(() => {
    if (!completedChallengeId) {
      return;
    }
    void refreshChallengesPendingDot();
  }, [completedChallengeId, refreshChallengesPendingDot]);

  useEffect(() => {
    void refreshChallengesPendingDot();
  }, [event?.id, event?.date, refreshChallengesPendingDot]);

  useEffect(() => {
    return () => {
      pendingDotGenerationRef.current += 1;
      abortPending();
    };
  }, [abortPending]);

  // --- Derived data
  const countdownEndsAt = useMemo(() => countdownEndsAtForEvent(event), [event]);

  const goingGuests = useMemo(() => eventGuestListGoingRows(event), [event]);
  const guestsAttendingCount = useMemo(() => eventGuestsGoing(event).length, [event]);
  const guestsPendingCount = useMemo(() => guestsPendingCountFromEvent(event), [event]);
  const participantNamesLine = useMemo(() => eventParticipantNamesLine(event), [event]);

  const hostsLine = useMemo(() => {
    if (!event || !session) {
      return '';
    }
    return hostsLineForDetailView(event, {
      isOrganizer,
      sessionUserName: session.user.name,
    });
  }, [event, isOrganizer, session]);

  const organizerGuestList = useMemo(
    () => (event ? organizerGuestListCounts(event) : { listConfirmed: 0, listTotalInvited: 0 }),
    [event],
  );

  // --- Handlers
  const onBackPress = useCallback(() => {
    goBack();
  }, [goBack]);

  const onLiveReaction = useCallback(
    async (
      spawnAt: SpawnFloatingReaction,
      { reaction, source, center }: EventDetailReactionPressPayload,
    ) => {
      if (!event?.id) {
        return;
      }
      const ok = await eventRepository.postEventReaction(event.id, reaction);
      if (ok) {
        spawnAt(source, center.x, center.y);
        return;
      }
      showShortUserMessage(t('eventDetail.reactionError'));
    },
    [event?.id, t],
  );

  const onFabCameraPress = useCallback(() => {
    if (!eventId) {
      return;
    }
    void analytics.trackAction('tap_event_detail_camera_fab', {
      what: 'event_detail_camera_fab',
      why: 'upload_event_photo',
      eventId,
      activeTab,
    });
    const eventTitle = event?.title ?? '';
    goToEventDetailCamera(eventId, eventTitle);
  }, [activeTab, event?.title, eventId, goToEventDetailCamera]);

  const onTabPress = useCallback(
    (tab: EventDetailTab) => {
      void analytics.trackAction('switch_event_detail_tab', {
        what: 'event_detail_tab',
        why: 'user_switch_tab',
        from_tab: activeTab,
        to_tab: tab,
        eventId,
      });
      setActiveTab(tab);
    },
    [activeTab, eventId, setActiveTab],
  );

  const onPullRefresh = useCallback(async () => {
    void analytics.trackAction('pull_to_refresh', {
      what: 'event_detail_pull_refresh',
      why: 'manual_refresh',
      tab: activeTab,
      eventId,
    });
    setIsDetailRefreshing(true);
    try {
      if (!eventId) {
        return;
      }

      if (activeTab === EventDetailTab.Overview) {
        await invalidateRemoteImageCache();
        await reloadEventDetail({ silent: true });
        return;
      }

      if (activeTab === EventDetailTab.Album) {
        await refetchAlbum();
        return;
      }

      if (activeTab === EventDetailTab.Challenges) {
        await refetchChallenges();
        return;
      }

      if (activeTab === EventDetailTab.Ranking) {
        await refetchRanking();
        return;
      }
    } finally {
      void refreshChallengesPendingDot();
      setIsDetailRefreshing(false);
    }
  }, [
    activeTab,
    eventId,
    invalidateRemoteImageCache,
    reloadEventDetail,
    refetchAlbum,
    refetchChallenges,
    refetchRanking,
    refreshChallengesPendingDot,
  ]);

  const onProfileAvatarPress = useCallback(() => {
    goToEventStories(eventId);
  }, [eventId, goToEventStories]);

  const onDetailRefresh = useCallback(() => {
    void onPullRefresh();
  }, [onPullRefresh]);

  const onCreateChallengeSheetOpen = useCallback(() => {
    void analytics.trackAction('open_create_challenge_sheet', {
      what: 'event_detail_create_challenge_sheet',
      why: 'create_challenge',
      eventId,
    });
    setIsCreateChallengeSheetOpen(true);
  }, [eventId]);

  const onCreateChallengeSheetClose = useCallback(() => {
    setIsCreateChallengeSheetOpen(false);
  }, []);

  const onCreateQuizChallengeSelect = useCallback(() => {
    setIsCreateChallengeSheetOpen(false);
    if (!eventId) {
      return;
    }
    goToEventChallengeQuizCreate(eventId);
  }, [eventId, goToEventChallengeQuizCreate]);

  const onCreatePhotoChallengeSelect = useCallback(() => {
    setIsCreateChallengeSheetOpen(false);
    if (!eventId) {
      return;
    }
    goToEventChallengePhotoCreate(eventId);
  }, [eventId, goToEventChallengePhotoCreate]);

  const onParticipantsModalOpen = useCallback(() => {
    if (!eventId) {
      return;
    }
    goToEventDetailParticipants(eventId);
  }, [eventId, goToEventDetailParticipants]);

  const data: EventDetailScreenData = {
    event,
    isLoading,
    isDetailRefreshing,
    isOrganizer,
    canHostEditChallenges,
    activeTab,
    detailVisibleTabs,
    completedByChallengeId: completedByChallengeIdForUi,
    challenges,
    isChallengesLoaded,
    rankingRows,
    albumPhotos,
    arePhotosLoaded,
    albumHasMore,
    isLoadingMoreAlbum,
    countdownEndsAt,
    goingGuests,
    guestsAttendingCount,
    guestsPendingCount,
    participantNamesLine,
    isPublicGuestListEnabled,
    isShareSheetOpen,
    isCreateChallengeSheetOpen,
    showChallengesPendingDot: challengesPendingDot,
    hostsLine,
    organizerGuestList,
  };

  const handlers: EventDetailScreenHandlers = {
    setActiveTab: onTabPress,
    setIsPublicGuestListEnabled,
    onBackPress,
    onPullRefresh,
    onDetailRefresh,
    onFabCameraPress,
    ...challengeHandlers,
    onProfileAvatarPress,
    onParticipantsModalOpen,
    ...shareHandlers,
    onCreateChallengeSheetOpen,
    onCreateChallengeSheetClose,
    onCreateQuizChallengeSelect,
    onCreatePhotoChallengeSelect,
    ...albumHandlers,
    onLiveReaction,
  };

  return { data, handlers };
}
