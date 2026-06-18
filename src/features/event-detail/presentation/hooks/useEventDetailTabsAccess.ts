import { subscribeEventDetailTabSwitch } from '../../data/eventDetailTabSwitch';
import { isEventOrganizerForUser } from '../../data/eventOrganizer';
import { EventDetailTab, FULL_DETAIL_TABS, GUEST_PRE_EVENT_DAY_TABS } from './eventDetailTabs';
import { useGuestEventDayOrPastTabBlocked } from './useGuestEventDayOrPastTabBlocked';
import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { isBeforeEventCalendarDay } from '@/src/features/home/presentation/components/utils/eventCalendar';
import { useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  initialTab?: EventDetailTab;
  reloadEventDetail: (opts?: { silent?: boolean }) => void | Promise<unknown>;
};

/**
 * Tab strip state, which tabs are visible for host vs guest and pre-event-day rules, and
 * guest “access” gating for challenges/ranking data loads.
 */
export function useEventDetailTabsAccess({
  eventId,
  event,
  initialTab,
  reloadEventDetail,
}: Params) {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<EventDetailTab>(initialTab ?? EventDetailTab.Overview);
  const prevTabRef = useRef<EventDetailTab | null>(null);
  const activeTabRef = useRef<EventDetailTab>(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const guestEventDayOrPastTabBlocked = useGuestEventDayOrPastTabBlocked(event);
  const isOrganizer = isEventOrganizerForUser(event, session?.user.id);

  /**
   * GET /api/events/:id — only when entering Detalle from another tab
   * (initial load is handled by {@link useEventDetail}).
   */
  useEffect(() => {
    const prev = prevTabRef.current;
    prevTabRef.current = activeTab;

    if (!eventId) {
      return;
    }
    const entersDetail =
      activeTab === EventDetailTab.Overview && prev !== null && prev !== activeTab;
    if (entersDetail) {
      void reloadEventDetail({ silent: true });
    }
  }, [activeTab, eventId, reloadEventDetail]);

  useEffect(() => {
    setActiveTab(initialTab ?? EventDetailTab.Overview);
  }, [initialTab, eventId]);

  const detailVisibleTabs = isOrganizer ? FULL_DETAIL_TABS : GUEST_PRE_EVENT_DAY_TABS;

  /** Organizer: crear/editar retos solo antes del día local del evento. */
  const canHostEditChallenges = useMemo(() => {
    if (!event?.date) {
      return false;
    }
    if (!isOrganizer) {
      return false;
    }
    return isBeforeEventCalendarDay(event.date);
  }, [event?.date, isOrganizer]);

  useEffect(() => {
    if (!detailVisibleTabs.includes(activeTab)) {
      setActiveTab(EventDetailTab.Overview);
    }
  }, [detailVisibleTabs, activeTab]);

  useEffect(() => {
    if (!eventId) {
      return;
    }
    return subscribeEventDetailTabSwitch(eventId, (tab) => {
      setActiveTab(tab);
    });
  }, [eventId]);

  return {
    activeTab,
    setActiveTab,
    activeTabRef,
    detailVisibleTabs,
    guestEventDayOrPastTabBlocked,
    isOrganizer,
    canHostEditChallenges,
  };
}
