import {
  EventDetailTab,
  FULL_DETAIL_TABS,
  GUEST_PRE_EVENT_DAY_TABS,
} from '../../../../navigation/eventDetailTabs';
import { subscribeEventDetailTabSwitch } from '../../data/eventDetailTabSwitch';
import { getEventOrganizerStatus } from '../../data/eventOrganizer';
import { useGuestEventDayOrPastTabBlocked } from './useGuestEventDayOrPastTabBlocked';
import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useEffect, useRef, useState } from 'react';

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
  const organizerStatus = getEventOrganizerStatus(event, session?.user.id);
  const isOrganizer = organizerStatus === 'organizer';
  const isOrganizerRoleLoading = Boolean(event?.id && organizerStatus === 'unknown');

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
    isOrganizerRoleLoading,
  };
}
