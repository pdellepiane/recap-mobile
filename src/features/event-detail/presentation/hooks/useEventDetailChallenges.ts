import { canUserEditQuizChallenge } from '../../data/eventChallengeQuizEdit';
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
import { EventDetailTab } from './eventDetailTabs';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { isEventHostedFromHomeFeed } from '@/src/features/events/data/homeEventCache';
import { isBeforeEventCalendarDay } from '@/src/features/home/presentation/components/utils/eventCalendar';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  activeTab: EventDetailTab;
  guestEventDayOrPastTabBlocked: boolean;
  completedChallengeId?: string;
  completedPoints?: number;
};

export function useEventDetailChallenges({
  eventId,
  event,
  activeTab,
  guestEventDayOrPastTabBlocked,
  completedChallengeId,
  completedPoints,
}: Params) {
  const { goToEventChallengeQuiz, goToEventChallengePhoto, goToEventChallengeQuizEdit } =
    useCoordinator();
  const { session } = useAuth();
  const mountedRef = useMountedRef();
  const refetchGenerationRef = useRef(0);
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [challenges, setChallenges] = useState<EventChallenge[]>([]);
  const [completedByChallengeId, setCompletedByChallengeId] = useState<Record<string, number>>({});

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
    const controller = beginRequest();
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

  /** After POST /challenges, repository refetches into cache; sync list without a second GET. */
  useEffect(() => {
    return subscribeEventChallengesListRefresh(eventId, () => {
      setChallenges(getEventChallenges(eventId));
      setCompletedByChallengeId(getEventChallengesCompletionSnapshot(eventId));
    });
  }, [eventId]);

  const refetchChallenges = useCallback(async () => {
    const generation = ++refetchGenerationRef.current;
    const controller = beginRequest();
    if (guestEventDayOrPastTabBlocked) {
      if (mountedRef.current && generation === refetchGenerationRef.current) {
        setChallenges([]);
      }
      endRequest(controller);
      return;
    }
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
      endRequest(controller);
    }
  }, [beginRequest, endRequest, eventId, guestEventDayOrPastTabBlocked, mountedRef]);

  const onChallengePress = useCallback(
    async (challenge: EventChallenge) => {
      if (!event) {
        return;
      }
      const isHost = isEventHostedFromHomeFeed(event.id);
      if (
        isHost &&
        canUserEditQuizChallenge(challenge, session?.user.id) &&
        challenge.kind === EventChallengeKind.Quiz
      ) {
        goToEventChallengeQuizEdit(event.id, challenge.id);
        return;
      }
      if (challenge.remoteCompletedPoints !== undefined) {
        return;
      }
      if (!isHost) {
        const trimmed = event.date?.trim() ?? '';
        const hasValidDate = trimmed.length > 0 && !Number.isNaN(Date.parse(trimmed));
        if (!hasValidDate || isBeforeEventCalendarDay(trimmed)) {
          return;
        }
      }
      if (challenge.kind === EventChallengeKind.Quiz) {
        goToEventChallengeQuiz(event.id, challenge.id, challenge.number);
        return;
      }
      goToEventChallengePhoto(event.id, challenge.id, challenge.number);
    },
    [event, goToEventChallengeQuiz, goToEventChallengePhoto, goToEventChallengeQuizEdit, session?.user.id],
  );

  const completedByChallengeIdForUi = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (c.remoteCompletedPoints !== undefined) {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    return { ...completedByChallengeId, ...fromApi };
  }, [challenges, completedByChallengeId]);

  const hasAnyCompletionForCurrentEvent = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (c.remoteCompletedPoints !== undefined) {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    const merged = { ...getEventChallengesCompletionSnapshot(eventId), ...completedByChallengeId, ...fromApi };
    const ids = new Set(challenges.map((r) => r.id));
    return Object.keys(merged).some((id) => ids.has(id));
  }, [eventId, challenges, completedByChallengeId]);

  return {
    challenges,
    completedByChallengeIdForUi,
    onChallengePress,
    refetchChallenges,
    hasAnyCompletionForCurrentEvent,
  };
}
