import type { EventDetailParticipantRow } from './participantRow';
import type { Event, EventGuest } from '@/src/domain/entities';
import { isDuringEventStartPlus24hWindow } from '@/src/features/home/presentation/components/utils/eventCalendar';

export function eventGuestsGoing(event: Event | null): EventGuest[] {
  return (event?.guests ?? []).filter((g) => g.rsvp === 'going');
}

export function eventGuestsNotGoing(event: Event | null): EventGuest[] {
  return (event?.guests ?? []).filter((g) => g.rsvp === 'not_going');
}

/** Countdown target — API `datetime` on the domain event. */
export function countdownEndsAtForEvent(event: Event | null): Date {
  if (!event?.date) {
    return new Date();
  }
  const ms = Date.parse(event.date);
  if (Number.isNaN(ms)) {
    return new Date();
  }
  return new Date(ms);
}

/**
 * Invitado: FAB de álbum y {@link isDuringEventStartPlus24hWindow} durante la ventana en vivo.
 * Anfitrión: siempre false (esas piezas no aplican).
 */
export function isNonOrganizerDuringStartPlus24hWindow(
  event: Event | null | undefined,
  isOrganizer: boolean,
  now: Date,
): boolean {
  if (isOrganizer) {
    return false;
  }
  const raw = event?.date?.trim();
  if (!raw || Number.isNaN(Date.parse(raw))) {
    return false;
  }
  return isDuringEventStartPlus24hWindow(raw, now);
}

/** Confirmed / total counts from `event.guests` + `rsvp`. */
export function organizerGuestListCounts(event: Event | null): {
  listConfirmed: number;
  listTotalInvited: number;
} {
  const all = event?.guests ?? [];
  const listConfirmed = eventGuestsGoing(event).length;
  const listTotalInvited = all.length > 0 ? all.length : listConfirmed;
  return { listConfirmed, listTotalInvited };
}

/** Guests not marked as going (declined or not attending), when we have a guest list. */
export function guestsPendingCountFromEvent(event: Event | null): number | undefined {
  const all = event?.guests;
  if (!all?.length) {
    return undefined;
  }
  return Math.max(0, all.length - eventGuestsGoing(event).length);
}

/** Hero participant name line from guests with `rsvp === 'going'`. */
export function eventParticipantNamesLine(event: Event | null): string {
  if (!event) {
    return '';
  }
  const fromGoing = eventGuestsGoing(event)
    .map((g) => g.name?.trim() ?? '')
    .filter((n) => n.length > 0)
    .join(', ');
  if (fromGoing) {
    return fromGoing;
  }
  return '';
}

/**
 * Hosts line for overview + facepile: organizer uses session name when hosting from feed;
 * otherwise joins `event.hosts` names; finally a translated fallback.
 */
export function hostsLineForDetailView(
  event: Event | null,
  opts: {
    isOrganizer: boolean;
    sessionUserName: string;
    /** When not organizer and API omits host names. */
    translatedFallback?: string;
  },
): string {
  if (event && opts.isOrganizer) {
    const me = opts.sessionUserName.trim();
    if (me) {
      return me;
    }
  }
  const fromHosts = (event?.hosts ?? [])
    .map((host) => host.name?.trim() ?? '')
    .filter((name) => name.length > 0)
    .join(', ');
  if (fromHosts) {
    return fromHosts;
  }
  return opts.translatedFallback ?? '';
}

export function buildOrganizerParticipantRows(
  event: Event | null,
  guestPlaceholder: string,
): EventDetailParticipantRow[] {
  const { listTotalInvited } = organizerGuestListCounts(event);
  const going = eventGuestsGoing(event);
  const notGoing = eventGuestsNotGoing(event);
  const confirmedNames = going.map((g, i) => ({
    id: `confirmed-${g.id}-${i}`,
    name: g.name,
    status: 'confirmed' as const,
  }));

  const pendingCount = Math.max(0, listTotalInvited - going.length);
  const pendingNamePool = notGoing.map((g) => g.name?.trim() ?? '');
  const pendingRows = Array.from({ length: pendingCount }, (_, i) => ({
    id: `pending-${i}`,
    name: pendingNamePool[i] || guestPlaceholder,
    status: 'pending' as const,
  }));

  const rows = [...confirmedNames, ...pendingRows];
  if (rows.length > 0) {
    return rows;
  }
  return [
    {
      id: 'fallback-participant',
      name: guestPlaceholder,
      status: 'pending',
    },
  ];
}
