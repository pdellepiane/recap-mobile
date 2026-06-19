import { EventDetailTab } from '../../../../navigation/eventDetailTabs';
import {
  EventChallengeKind,
  getEventChallenges,
  type EventChallenge,
} from '../../data/eventChallenges';
import {
  getEventChallengesCompletionSnapshot,
  recordEventChallengeCompletion,
} from '../../data/eventChallengesCompletionStore';
import { subscribeEventChallengesListRefresh } from '../../data/eventChallengesListRefresh';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event } from '@/src/domain/entities';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  activeTab: EventDetailTab;
  guestEventDayOrPastTabBlocked: boolean;
  completedChallengeId?: string;
  completedPoints?: number;
  isOrganizer: boolean;
  /**
   * Route intent from notification/deeplink actions like `/events/:eventId/challenges/:challengeId`.
   * The event detail screen first opens the Challenges tab, then this hook opens the target challenge
   * once the challenge list is loaded.
   */
  openChallengeId?: string;
};

export function useEventDetailChallenges({
  eventId,
  event,
  activeTab,
  guestEventDayOrPastTabBlocked,
  completedChallengeId,
  completedPoints,
  isOrganizer,
  openChallengeId,
}: Params) {
  const {
    goToEventChallengeQuiz,
    goToEventChallengePhoto,
    goToEventChallengeQuizEdit,
    goToEventChallengePhotoEdit,
  } = useCoordinator();
  const mountedRef = useMountedRef();
  const refetchGenerationRef = useRef(0);
  const openedChallengeIdRef = useRef<string | null>(null);
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [challenges, setChallenges] = useState<EventChallenge[]>([]);
  const [isChallengesLoaded, setIsChallengesLoaded] = useState(false);
  const [completedByChallengeId, setCompletedByChallengeId] = useState<Record<string, number>>({});

  /** Load the Challenges tab data lazily when the user (or a push/deeplink) opens the tab. */
  useEffect(() => {
    if (activeTab !== EventDetailTab.Challenges || !event?.id) {
      return;
    }
    if (guestEventDayOrPastTabBlocked) {
      setChallenges([]);
      setIsChallengesLoaded(true);
      return;
    }
    setChallenges(getEventChallenges(eventId));
    const controller = beginRequest();
    setIsChallengesLoaded(false);
    void (async () => {
      try {
        const rows = await eventRepository.fetchEventChallenges(eventId, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setChallenges(rows);
        }
      } catch (e) {
        if (!isAbortError(e)) {
          setChallenges(getEventChallenges(eventId));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsChallengesLoaded(true);
        }
        endRequest(controller);
      }
    })();
    return () => {
      abortAll();
    };
  }, [
    abortAll,
    activeTab,
    beginRequest,
    endRequest,
    event?.id,
    eventId,
    guestEventDayOrPastTabBlocked,
  ]);

  /** Refresh locally recorded completions when the event changes or Challenges becomes active. */
  useEffect(() => {
    setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
  }, [activeTab, eventId]);

  /**
   * Challenge completion screens navigate back with `completedChallengeId` and points in the route.
   * Persist that completion locally so the list immediately shows the completed state.
   */
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

  /** Sync the cached challenges list after create/edit flows update it elsewhere. */
  useEffect(() => {
    return subscribeEventChallengesListRefresh(eventId, () => {
      setChallenges(getEventChallenges(eventId));
      setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
    });
  }, [eventId]);

  // Refetch challenges when user pulls to refresh.
  const refetchChallenges = useCallback(async () => {
    const generation = ++refetchGenerationRef.current;
    const controller = beginRequest();
    if (guestEventDayOrPastTabBlocked) {
      if (mountedRef.current && generation === refetchGenerationRef.current) {
        setChallenges([]);
        setIsChallengesLoaded(true);
      }
      endRequest(controller);
      return;
    }
    setIsChallengesLoaded(false);
    try {
      const nextChallenges = await eventRepository.fetchEventChallenges(eventId, {
        signal: controller.signal,
      });
      if (!mountedRef.current || generation !== refetchGenerationRef.current) {
        return;
      }
      setChallenges(nextChallenges);
    } catch (e) {
      if (!isAbortError(e) && mountedRef.current && generation === refetchGenerationRef.current) {
        setChallenges(getEventChallenges(eventId));
      }
    } finally {
      if (mountedRef.current && generation === refetchGenerationRef.current) {
        setIsChallengesLoaded(true);
      }
      endRequest(controller);
    }
  }, [beginRequest, endRequest, eventId, guestEventDayOrPastTabBlocked, mountedRef]);

  // Navigate to challenge when pressing a challenge.
  const onChallengePress = useCallback(
    (challenge: EventChallenge) => {
      if (!event) {
        return;
      }
      if (challenge.kind === EventChallengeKind.Quiz) {
        goToEventChallengeQuiz(event.id, challenge.id, challenge.number);
      } else {
        goToEventChallengePhoto(event.id, challenge.id, challenge.number);
      }
      // if (isOrganizer) {
      //   if (challenge.kind === EventChallengeKind.Quiz) {
      //     goToEventChallengeQuizEdit(event.id, challenge.id);
      //   } else {
      //     goToEventChallengePhotoEdit(event.id, challenge.id, challenge.number);
      //   }
      // } else {
      //   if (challenge.kind === EventChallengeKind.Quiz) {
      //     goToEventChallengeQuiz(event.id, challenge.id, challenge.number);
      //   } else {
      //     goToEventChallengePhoto(event.id, challenge.id, challenge.number);
      //   }
      // }
    },
    [
      event,
      isOrganizer,
      goToEventChallengeQuiz,
      goToEventChallengePhoto,
      goToEventChallengeQuizEdit,
      goToEventChallengePhotoEdit,
    ],
  );

  /** Allow a new notification/deeplink intent to open when the event or target challenge changes. */
  useEffect(() => {
    openedChallengeIdRef.current = null;
  }, [eventId, openChallengeId]);

  /**
   * Auto-open the challenge requested by a notification/deeplink.
   *
   * Example:
   * API action `/events/1/challenges/5`
   * -> route `/event/1?tab=challenges&openChallengeId=5`
   * -> this effect waits for challenge rows, finds `5`, then reuses `onChallengePress`.
   *
   * `openedChallengeIdRef` prevents reopening the same target on rerenders.
   */
  useEffect(() => {
    const challengeId = openChallengeId?.trim();
    if (!challengeId || !isChallengesLoaded || openedChallengeIdRef.current === challengeId) {
      return;
    }
    const challenge = challenges.find((row) => row.id === challengeId);
    if (!challenge) {
      return;
    }
    openedChallengeIdRef.current = challengeId;
    onChallengePress(challenge);
  }, [challenges, eventId, isChallengesLoaded, onChallengePress, openChallengeId]);

  /** Completed challenges for UI. */
  const completedByChallengeIdForUi = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (c.remoteCompletedPoints !== undefined) {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    return { ...completedByChallengeId, ...fromApi };
  }, [challenges, completedByChallengeId]);

  return {
    challenges,
    isChallengesLoaded,
    completedByChallengeIdForUi,
    onChallengePress,
    refetchChallenges,
    handlers: {
      onChallengePress,
    },
  };
}
