import type { Event } from '@/src/domain/entities';
import { isEventOrganizerForUser } from '../../data/eventOrganizer';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { isBeforeEventCalendarDay } from '@/src/features/home/presentation/components/utils/eventCalendar';
import { useMemo } from 'react';

/**
 * Retos y ranking: anfitrión siempre; invitado solo el día del evento (calendario local) o después.
 * Invitado sin fecha válida: no cargar desde API.
 */
export function useGuestEventDayOrPastTabBlocked(event: Event | null | undefined): boolean {
  const { session } = useAuth();

  return useMemo(() => {
    if (!event?.id) {
      return false;
    }
    if (isEventOrganizerForUser(event, session?.user.id)) {
      return false;
    }
    const trimmed = event.date?.trim() ?? '';
    const hasValidDate = trimmed.length > 0 && !Number.isNaN(Date.parse(trimmed));
    if (!hasValidDate) {
      return true;
    }
    return isBeforeEventCalendarDay(trimmed);
  }, [event, session?.user.id]);
}
