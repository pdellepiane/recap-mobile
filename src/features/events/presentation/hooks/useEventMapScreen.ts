import { getMapsSearchQueryForEvent, googleMapsSearchUrl } from '../data/eventDetailExtras';
import { useEventDetail } from './useEventDetail';
import { useMemo } from 'react';

type Params = {
  eventId: string;
  initialQuery?: string;
};

/**
 * Resolves map query/url for the map screen from navigation param or event data.
 */
export function useEventMapScreen({ eventId, initialQuery }: Params) {
  const { event, isLoading } = useEventDetail(eventId);

  const needsEvent = !initialQuery?.trim();
  const showLoader = needsEvent && isLoading;

  const query = useMemo(() => {
    const fromNav = initialQuery?.trim();
    if (fromNav) {
      return fromNav;
    }
    if (!event) {
      return null;
    }
    return getMapsSearchQueryForEvent(eventId, event);
  }, [initialQuery, event, eventId]);

  const uri = query ? googleMapsSearchUrl(query) : null;

  return { showLoader, uri };
}
