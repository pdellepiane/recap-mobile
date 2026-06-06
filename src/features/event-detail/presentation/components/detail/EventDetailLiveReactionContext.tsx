import { isNonOrganizerDuringStartPlus24hWindow } from '@/src/features/event-detail/data/eventDetailDerived';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import type { Event } from '@/src/domain/entities';
import { FloatingReactions, type SpawnFloatingReaction } from '@/src/ui';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

const EventDetailLiveReactionContext = createContext<
  ((payload: EventDetailReactionPressPayload) => void) | undefined
>(undefined);

export function useEventDetailLiveReactionPress():
  | ((payload: EventDetailReactionPressPayload) => void)
  | undefined {
  return useContext(EventDetailLiveReactionContext);
}

type ProviderProps = {
  event: Event;
  isOrganizer: boolean;
  onLiveReaction: (
    spawnAt: SpawnFloatingReaction,
    payload: EventDetailReactionPressPayload,
  ) => void | Promise<void>;
  children: ReactNode;
};

/**
 * Mounts {@link FloatingReactions} only during the guest live window.
 * Exposes a stable `onReactionPress` via context so scroll content does not re-render on ticks.
 */
export function EventDetailLiveReactionProvider({
  event,
  isOrganizer,
  onLiveReaction,
  children,
}: ProviderProps) {
  const isGuestLiveActionsVisible = useMemo(
    () => isNonOrganizerDuringStartPlus24hWindow(event, isOrganizer, new Date()),
    [event, isOrganizer],
  );

  const spawnAtRef = useRef<SpawnFloatingReaction | null>(null);
  const onReactionPress = useCallback(
    (payload: EventDetailReactionPressPayload) => {
      const spawnAt = spawnAtRef.current;
      if (spawnAt) {
        void onLiveReaction(spawnAt, payload);
      }
    },
    [onLiveReaction],
  );

  if (!isGuestLiveActionsVisible) {
    return (
      <EventDetailLiveReactionContext.Provider value={undefined}>
        {children}
      </EventDetailLiveReactionContext.Provider>
    );
  }

  return (
    <FloatingReactions maxConcurrent={10}>
      {(spawnAt) => {
        spawnAtRef.current = spawnAt;
        return (
          <EventDetailLiveReactionContext.Provider value={onReactionPress}>
            {children}
          </EventDetailLiveReactionContext.Provider>
        );
      }}
    </FloatingReactions>
  );
}
