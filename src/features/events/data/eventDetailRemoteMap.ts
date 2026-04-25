import type { EventDetailData } from '@/src/core/api/types';
import type { Event as DomainEvent } from '@/src/domain/entities';

/** Maps GET /api/events/:id `data` into the shared {@link Event} model. */
export function mapEventDetailDataToDomain(data: EventDetailData): DomainEvent {
  const locationParts = [data.location?.trim(), data.city?.trim()].filter(
    (p): p is string => Boolean(p && p.length > 0),
  );
  const location = locationParts.length > 0 ? locationParts.join(', ') : data.city ?? '';
  const descriptionParts = [data.type, data.type_detail, data.stage].filter(
    (p): p is string => Boolean(p && String(p).trim().length > 0),
  );
  const guests = Array.isArray(data.guests_going) ? data.guests_going : [];
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
  const cover = data.cover?.trim();
  const previewGuestNames = guests
    .map((g) => g.name?.trim())
    .filter((n): n is string => Boolean(n && n.length > 0))
    .slice(0, 3);
  return {
    id: String(data.id),
    title: data.name,
    date: data.datetime,
    location,
    description: descriptionParts.join(' · '),
    ...(cover ? { coverImageUrl: cover } : {}),
    slug: data.slug,
    guestCount: guests.length,
    guestsRespondedCount,
    guestsAttendingCount,
    hostsLine: data.hosts,
    guestsLine: data.guests,
    typeDetail: data.type_detail,
    stage: data.stage,
    ...(previewGuestNames.length > 0 ? { previewGuestNames } : {}),
  };
}
