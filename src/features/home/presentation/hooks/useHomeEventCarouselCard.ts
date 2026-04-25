import { HomeEventVariant } from '../types';
import {
  eventDateBadgeParts,
  firstNameFromDisplayName,
  formatCarouselGuestCountLabel,
  getEventType,
} from '../utils/eventDisplay';
import { EventType } from '@/src/core/api';
import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { initialsFromFullName, parseHostsFromLine } from '@/src/ui';
import { useMemo } from 'react';

export type HomeEventCarouselCardView = {
  day: string;
  month: string;
  guestLabel: string;
  type: EventType;
  faceNames: string[];
  coverInitials: string;
  coverLabel: string;
};

/**
 * Deriva textos y listas para la tarjeta del carrusel de eventos (fecha, invitados, portada).
 */
export function useHomeEventCarouselCard(
  event: Event,
  variant: HomeEventVariant = HomeEventVariant.Hosted,
): HomeEventCarouselCardView {
  const { session } = useAuth();

  return useMemo(() => {
    const { day, month } = eventDateBadgeParts(event.date);
    const guestLabel = formatCarouselGuestCountLabel(event.guestCount ?? 0);
    const type = getEventType(event.date);

    const hostNames = parseHostsFromLine(event.hostsLine?.trim() ?? '');
    const firstHost = hostNames[0] ?? '';

    const faceNames =
      event.previewGuestNames && event.previewGuestNames.length > 0
        ? event.previewGuestNames.slice(0, 3)
        : hostNames.slice(0, 3);

    const coverInitials =
      variant === HomeEventVariant.Hosted
        ? initialsFromFullName(session?.user.name ?? '')
        : initialsFromFullName(firstHost);
    const coverLabel =
      variant === HomeEventVariant.Hosted
        ? 'Por ti'
        : firstHost
          ? firstNameFromDisplayName(firstHost)
          : 'Anfitrión';

    return {
      day,
      month,
      guestLabel,
      type,
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
