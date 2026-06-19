import type { Event } from '@/src/domain/entities';

export type EventOrganizerStatus = 'organizer' | 'guest' | 'unknown';

/**
 * Source of truth for organizer UI gates.
 *
 * Prefer per-event data over the Home feed cache:
 * - `hosts[].id` is the primary source because an event can have multiple anfitriones.
 *   Home/detail API mappers map this from host `user_id` when available.
 * - `ownerUserId` (`user_id`) is only a fallback when the API omits `hosts`.
 */
export function getEventOrganizerStatus(
  event: Event | null | undefined,
  userId: string | undefined,
): EventOrganizerStatus {
  const normalizedUserId = userId?.trim();
  if (!event || !normalizedUserId) {
    return 'unknown';
  }

  const hosts = event.hosts ?? [];
  if (event.organizerUserIdsResolved === true && hosts.length > 0) {
    return hosts.some((host) => host.id.trim() === normalizedUserId) ? 'organizer' : 'guest';
  }

  if (event.ownerUserId?.trim()) {
    return event.ownerUserId.trim() === normalizedUserId ? 'organizer' : 'guest';
  }

  return 'unknown';
}
