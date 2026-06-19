/**
 * Maps API event payloads (home lists + GET /api/events/:id) to domain {@link Event}.
 */
import type { EventDetailData, HomeEventGuestItem, HomeEventItem } from '@/src/core/api/types';
import type { Event } from '@/src/domain/entities';

const SHARE_EVENT_BASE = 'https://recap.sinenvolturas.com/event';

function shareUrlFromIdentity(id: string, slug?: string | null): string {
  const s = slug?.trim();
  if (s) {
    return `${SHARE_EVENT_BASE}/${s}`;
  }
  return `${SHARE_EVENT_BASE}/${id}`;
}

function locationFromParts(
  locationRaw: string | null | undefined,
  cityRaw: string | null | undefined,
): string {
  const locationParts = [locationRaw?.trim(), cityRaw?.trim()].filter((p): p is string =>
    Boolean(p && p.length > 0),
  );
  return locationParts.length > 0 ? locationParts.join(', ') : (cityRaw?.trim() ?? '');
}

function safeGuestPayload(data: EventDetailData): {
  going: HomeEventGuestItem[];
  notGoing: HomeEventGuestItem[];
} {
  const g = data.guests;
  if (!g || typeof g !== 'object') {
    return {
      going: [] as HomeEventGuestItem[],
      notGoing: [] as HomeEventGuestItem[],
    };
  }
  const goingRaw = Array.isArray(g.going) ? g.going : [];
  const goingGuests = goingRaw.filter((row): row is HomeEventGuestItem => row != null);
  const notGoingRaw = Array.isArray(g.not_going) ? g.not_going : [];
  const notGoingGuests = notGoingRaw.filter((row): row is HomeEventGuestItem => row != null);
  return { going: goingGuests, notGoing: notGoingGuests };
}

/** Maps GET /api/home/* event rows to the domain {@link Event} used on home and detail. */
export function mapHomeEventApiItemToDomain(remote: HomeEventItem): Event {
  const venue = remote.location?.trim() ?? '';
  const city = remote.city?.trim() ?? '';
  const location = locationFromParts(remote.location, remote.city);
  const descriptionParts = [remote.type, remote.stage].filter((p): p is string =>
    Boolean(p && String(p).trim().length > 0),
  );
  const guests = Array.isArray(remote.guests) ? remote.guests : [];
  const cover = typeof remote.cover === 'string' ? remote.cover.trim() : '';
  const hosts = (Array.isArray(remote.hosts) ? remote.hosts : [])
    .map((host) => ({
      id: String(host.user_id ?? host.id),
      name: host.name?.trim() ?? '',
      ...(host.email?.trim() ? { email: host.email.trim() } : {}),
    }))
    .filter((host) => host.name.length > 0);
  const hasHostUserIds =
    Array.isArray(remote.hosts) && remote.hosts.some((host) => host.user_id != null);

  const eventGuests = guests
    .map((g) => ({
      id: String(g.id),
      name: g.name?.trim() ?? '',
      rsvp: g.will_attend !== 0 ? ('going' as const) : ('not_going' as const),
    }))
    .filter((g) => g.name.length > 0);

  const id = String(remote.id);
  return {
    id,
    title: remote.name,
    date: remote.datetime ?? '',
    location,
    ...(city.length > 0 ? { city } : {}),
    ...(venue.length > 0 ? { venue } : {}),
    description: descriptionParts.join(' · '),
    shareUrl: shareUrlFromIdentity(id, remote.slug),
    ...(cover.length > 0 ? { coverImageUrl: cover } : {}),
    ...(hasHostUserIds ? { organizerUserIdsResolved: true } : {}),
    ...(hosts.length > 0 ? { hosts } : {}),
    ...(eventGuests.length > 0 ? { guests: eventGuests } : {}),
  };
}

/** Maps GET /api/events/:id `data` into the shared {@link Event} model. */
export function mapEventDetailDataToDomain(data: EventDetailData): Event {
  const venue = data.location?.trim() ?? '';
  const city = data.city?.trim() ?? '';
  const location = locationFromParts(data.location, data.city);
  const descriptionParts = [data.type, data.type_detail, data.stage].filter((p): p is string =>
    Boolean(p && String(p).trim().length > 0),
  );
  const { going: goingGuests, notGoing: notGoingGuests } = safeGuestPayload(data);

  const cover = data.cover?.trim();
  const eventGuests = [
    ...goingGuests.map((g) => ({
      id: String(g.id),
      name: g.name?.trim() || '',
      rsvp: 'going' as const,
    })),
    ...notGoingGuests.map((g) => ({
      id: String(g.id),
      name: g.name?.trim() || '',
      rsvp: 'not_going' as const,
    })),
  ].filter((guest) => guest.name.length > 0);

  const hosts =
    Array.isArray(data.hosts) && data.hosts.length > 0
      ? data.hosts
          .map((host) => ({
            id: String(host?.user_id ?? host?.id ?? ''),
            name: host?.name?.trim() ?? '',
            ...(host?.email?.trim() ? { email: host.email.trim() } : {}),
          }))
          .filter((host) => host.id.length > 0 && host.name.length > 0)
      : [];
  const hasHostUserIds =
    Array.isArray(data.hosts) && data.hosts.some((host) => host?.user_id != null);

  const id = String(data.id);
  const showGuestList =
    typeof data.show_guest_list === 'boolean' ? data.show_guest_list : undefined;
  return {
    id,
    title: data.name,
    date: data.datetime ?? '',
    location,
    ...(city.length > 0 ? { city } : {}),
    ...(venue.length > 0 ? { venue } : {}),
    description: descriptionParts.join(' · '),
    shareUrl: shareUrlFromIdentity(id, data.slug),
    ...(data.user_id != null ? { ownerUserId: String(data.user_id) } : {}),
    organizerUserIdsResolved: hasHostUserIds || data.user_id != null,
    ...(cover ? { coverImageUrl: cover } : {}),
    ...(hosts.length > 0 ? { hosts } : {}),
    ...(eventGuests.length > 0 ? { guests: eventGuests } : {}),
    ...(showGuestList !== undefined ? { showGuestList } : {}),
  };
}
