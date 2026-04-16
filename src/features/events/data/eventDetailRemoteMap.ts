import type { EventDetailData, HomeEventItem } from '@/src/core/api/types';
import type { Event as DomainEvent } from '@/src/domain/entities';

/** Mock `hosts` string for GET /api/events/:id when building from a home list row (realistic names per event). */
export function mockHostsLineFromHomeItem(item: HomeEventItem): string {
  const byId: Record<number, string> = {
    11001: 'Mariel Santos y Jorge Panduro',
    11002: 'Lucía Vargas y Martín Soto',
    11003: 'Andrea Méndez y Daniela Ríos',
    11004: 'Ricardo Núñez y Patricia Gómez',
    11005: 'Valeria Costa y Diego Salas',
    11006: 'Carolina Ríos y Felipe Bruno',
    11007: 'Gabriela Ortiz y Miguel Ángel Paredes',
    11008: 'Sofía Linares y Ricardo Mestanza',
    11009: 'Paula Vega y Diego Herrera',
    12001: 'Valentina Cruz y Nicolás Vera',
    12002: 'Camila Duarte y Rodrigo Silva',
  };
  return byId[item.id] ?? 'Ana Torres y Luis Fernández';
}

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
  };
}

/**
 * Builds an API-shaped detail payload from a home list row (for mock remote responses).
 */
export function homeEventItemToEventDetailData(item: HomeEventItem): EventDetailData {
  const n = item.guests?.length ?? 0;
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    hosts: mockHostsLineFromHomeItem(item),
    guests: n === 1 ? '1 invitado en lista' : `${String(n)} invitados en lista`,
    type: item.type,
    type_detail: 'Vista detallada (mock)',
    datetime: item.datetime,
    with_time: item.with_time,
    stage: item.stage,
    city: item.city,
    country_id: 604,
    location: item.location,
    cover: item.cover?.trim() ?? '',
    is_visible: 1,
    is_public: 1,
    user_id: 1,
    timezone: item.timezone,
    created_at: item.created_at,
    updated_at: item.updated_at,
    guests_going: item.guests ?? [],
  };
}
