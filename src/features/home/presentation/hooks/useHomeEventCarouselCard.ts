import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { initialsFromFullName, parseHostsFromLine } from '@/src/ui';
import { useMemo } from 'react';

import {
  eventDateBadgeParts,
  firstNameFromDisplayName,
  formatCarouselGuestCountLabel,
  getHomeCarouselScheduleKind,
} from '../utils/eventDisplay';
import type { HomeCarouselScheduleKind } from '../utils/eventDisplay';

export type HomeEventCarouselCardVariant = 'hosted' | 'guest';

export type HomeEventCarouselCardView = {
  day: string;
  month: string;
  guestLabel: string;
  scheduleKind: HomeCarouselScheduleKind | null;
  faceNames: string[];
  coverInitials: string;
  coverLabel: string;
};

/**
 * Deriva textos y listas para la tarjeta del carrusel de eventos (fecha, invitados, portada).
 */
export function useHomeEventCarouselCard(
  event: Event,
  variant: HomeEventCarouselCardVariant = 'hosted',
): HomeEventCarouselCardView {
  const { session } = useAuth();

  return useMemo(() => {
    const { day, month } = eventDateBadgeParts(event.date);
    const guestLabel = formatCarouselGuestCountLabel(event.guestCount ?? 0);
    const scheduleKind = getHomeCarouselScheduleKind(event.date);

    const hostNames = parseHostsFromLine(event.hostsLine?.trim() ?? '');
    const firstHost = hostNames[0] ?? '';

    const faceNames =
      event.previewGuestNames && event.previewGuestNames.length > 0
        ? event.previewGuestNames.slice(0, 3)
        : hostNames.slice(0, 3);

    const coverInitials =
      variant === 'guest'
        ? initialsFromFullName(session?.user.name ?? '')
        : initialsFromFullName(firstHost);
    const coverLabel =
      variant === 'guest' ? 'Por ti' : firstHost ? firstNameFromDisplayName(firstHost) : 'Anfitrión';

    return {
      day,
      month,
      guestLabel,
      scheduleKind,
      faceNames,
      coverInitials,
      coverLabel,
    };
  }, [
    event.date,
    event.guestCount,
    event.hostsLine,
    event.previewGuestNames,
    variant,
    session?.user.name,
  ]);
}
