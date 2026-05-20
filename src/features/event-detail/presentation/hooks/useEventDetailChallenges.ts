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
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const { goToEventChallengeQuiz, goToEventChallengePhoto } = useCoordinator();
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
    if (guestEventDayOrPastTabBlocked) {
      setChallenges([]);
      return;
    }
    const nextChallenges = await eventRepository.fetchEventChallenges(eventId);
    setChallenges(nextChallenges);
  }, [eventId, guestEventDayOrPastTabBlocked]);

  const onChallengePress = useCallback(
    async (challenge: EventChallenge) => {
      if (!event) {
        return;
      }
      const isHost = isEventHostedFromHomeFeed(event.id);
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
    [event, goToEventChallengeQuiz, goToEventChallengePhoto],
  );

  const completedByChallengeIdForUi = useMemo(() => {
    const fromApi: Record<string, number> = {};
    for (const c of challenges) {
      if (typeof c.remoteCompletedPoints === 'number') {
        fromApi[c.id] = c.remoteCompletedPoints;
      }
    }
    return { ...fromApi, ...completedByChallengeId };
  }, [challenges, completedByChallengeId]);

  const hasAnyCompletionForCurrentEvent = useMemo(() => {
    const snapshot = getEventChallengesCompletionSnapshot(eventId);
    const merged = { ...snapshot, ...completedByChallengeId };
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
