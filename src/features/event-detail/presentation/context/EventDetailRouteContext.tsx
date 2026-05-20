import { useEventDetail } from '../hooks/useEventDetail';
import { eventRepository } from '@/src/core/di/container';
import { useTranslation } from '@/src/i18n';
import { showShortUserMessage } from '@/src/ui';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type EventDetailRouteContextValue = ReturnType<typeof useEventDetail> & {
  eventId: string;
  isPublicGuestListEnabled: boolean;
  setIsPublicGuestListEnabled: Dispatch<SetStateAction<boolean>>;
};

const EventDetailRouteContext = createContext<EventDetailRouteContextValue | null>(null);

export function EventDetailRouteProvider({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const detail = useEventDetail(eventId);
  const { setEventShowGuestList, ...detailRest } = detail;
  const [isPublicGuestListEnabled, setIsPublicGuestListEnabledState] = useState(true);

  useEffect(() => {
    if (detailRest.event?.showGuestList !== undefined) {
      setIsPublicGuestListEnabledState(detailRest.event.showGuestList);
    }
  }, [detailRest.event?.id, detailRest.event?.showGuestList]);

  const setIsPublicGuestListEnabled = useCallback(
    (next: SetStateAction<boolean>) => {
      setIsPublicGuestListEnabledState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        if (!eventId) {
          return resolved;
        }
        void (async () => {
          const updated = await eventRepository.patchEventSettings(eventId, {
            show_guest_list: resolved,
          });
          if (!updated) {
            setIsPublicGuestListEnabledState(prev);
            showShortUserMessage(t('eventDetail.guestListSettingsUpdateError'));
            return;
          }
          setEventShowGuestList(updated.show_guest_list);
        })();
        return resolved;
      });
    },
    [eventId, setEventShowGuestList, t],
  );

  const value: EventDetailRouteContextValue = {
    ...detailRest,
    setEventShowGuestList,
    eventId,
    isPublicGuestListEnabled,
    setIsPublicGuestListEnabled,
  };

  return (
    <EventDetailRouteContext.Provider value={value}>{children}</EventDetailRouteContext.Provider>
  );
}

export function useEventDetailRoute(): EventDetailRouteContextValue {
  const ctx = useContext(EventDetailRouteContext);
  if (!ctx) {
    throw new Error('useEventDetailRoute must be used within EventDetailRouteProvider');
  }
  return ctx;
}
