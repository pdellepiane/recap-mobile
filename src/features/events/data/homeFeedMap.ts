import type { HomeEventItem } from '@/src/core/api/types';
import type { Event } from '@/src/domain/entities';
import { mockHostsLineFromHomeItem } from '@/src/features/events/data/eventDetailRemoteMap';

/** Maps GET /api/home/* event rows to the domain {@link Event} used on home and detail. */
export function mapHomeEventApiItemToDomain(remote: HomeEventItem): Event {
  const locationParts = [remote.location?.trim(), remote.city?.trim()].filter(
    (p): p is string => Boolean(p && p.length > 0),
  );
  const location = locationParts.length > 0 ? locationParts.join(', ') : remote.city ?? '';
  const descriptionParts = [remote.type, remote.stage].filter(
    (p): p is string => Boolean(p && String(p).trim().length > 0),
  );
  const guests = Array.isArray(remote.guests) ? remote.guests : [];
  let guestsRespondedCount = 0;
  let guestsAttendingCount = 0;
  for (const g of guests) {
    if (g.has_responded !== 0) {
      guestsRespondedCount += 1;
    }
    if (g.will_attend !== 0) {
      guestsAttendingCount += 1;
    }
  }
  const cover = typeof remote.cover === 'string' ? remote.cover.trim() : '';
  const previewGuestNames = guests
    .map((g) => g.name?.trim())
    .filter((n): n is string => Boolean(n && n.length > 0))
    .slice(0, 3);
  return {
    id: String(remote.id),
    title: remote.name,
    date: remote.datetime,
    location,
    description: descriptionParts.join(' · '),
    ...(cover.length > 0 ? { coverImageUrl: cover } : {}),
    slug: remote.slug,
    stage: remote.stage,
    guestCount: guests.length,
    guestsRespondedCount,
    guestsAttendingCount,
    /** Home list rows omit `hosts`; use the same mock line as detail until the API adds it. */
    hostsLine: mockHostsLineFromHomeItem(remote),
    ...(previewGuestNames.length > 0 ? { previewGuestNames } : {}),
  };
}
