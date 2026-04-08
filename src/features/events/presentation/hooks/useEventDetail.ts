import { eventRepository } from '@/src/core/di/container';
import { Event } from '@/src/domain/entities';
import { useCallback, useEffect, useState } from 'react';

export const useEventDetail = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const foundEvent = await eventRepository.getEventById(eventId);
      setEvent(foundEvent);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  return {
    event,
    isLoading,
    reload: loadEvent,
  };
};
