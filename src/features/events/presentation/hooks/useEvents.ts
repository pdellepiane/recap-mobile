import { useCallback, useEffect, useState } from 'react';

import { eventRepository } from '@/src/core/di/container';
import { Event } from '@/src/domain/models';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await eventRepository.getEvents();
      setEvents(list);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    isLoading,
    reload: loadEvents,
  };
};
