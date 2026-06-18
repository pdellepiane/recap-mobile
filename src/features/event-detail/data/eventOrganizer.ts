import type { Event } from '@/src/domain/entities';

/**
 * Source of truth for organizer UI gates.
 *
 * Prefer per-event data over the Home feed cache:
 * - `hosts[].id` is the primary source because an event can have multiple anfitriones.
 * - `ownerUserId` (`user_id`) is only a fallback when the API omits `hosts`.
 */
export function isEventOrganizerForUser(
  event: Event | null | undefined,
  userId: string | undefined,
): boolean {
  const normalizedUserId = userId?.trim();
  if (!event || !normalizedUserId) {
    return false;
  }

  const hosts = event.hosts ?? [];
  if (hosts.length > 0) {
    return hosts.some((host) => host.id.trim() === normalizedUserId);
  }

  return event.ownerUserId?.trim() === normalizedUserId;
}
