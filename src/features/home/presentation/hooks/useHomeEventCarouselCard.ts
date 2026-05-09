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
import { initialsFromFullName } from '@/src/ui';
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
    const guestLabel = formatCarouselGuestCountLabel(event.guests?.length ?? 0);
    const type = getEventType(event.date);

    const hostNames = (event.hosts ?? [])
      .map((host) => host.name.trim())
      .filter((name) => name.length > 0);
    const firstHost = hostNames[0] ?? '';

    /** Solo invitados en la fila de caras (nunca anfitriones): coincide con {@link formatCarouselGuestCountLabel}. */
    const faceNames = (event.guests ?? [])
      .map((guest) => guest.name.trim())
      .filter((name) => name.length > 0)
      .slice(0, 3);

    const coverInitials =
      variant === HomeEventVariant.Hosted
        ? initialsFromFullName(session?.user.name ?? '')
        : initialsFromFullName(firstHost);
    const coverLabel =
      variant === HomeEventVariant.Hosted
        ? 'ti'
        : firstHost
          ? firstNameFromDisplayName(firstHost)
          : '';

    return {
      day,
      month,
      guestLabel,
      type,
      faceNames,
      coverInitials,
      coverLabel,
    };
  }, [event.date, event.hosts, event.guests, variant, session?.user.name]);
}
