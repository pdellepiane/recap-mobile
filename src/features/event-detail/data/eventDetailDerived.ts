import type { EventDetailParticipantRow } from './participantRow';
import { EventType } from '@/src/core/api';
import type { Event, EventGuest } from '@/src/domain/entities';
import {
  isBeforeEventStartInstant,
  isDuringEventStartPlus24hWindow,
} from '@/src/features/home/presentation/components/utils/eventCalendar';
import { getEventType } from '@/src/features/home/presentation/utils/eventDisplay';

export type EventGuestListRow = {
  id: string;
  name: string;
  initial: string;
};

function mapGuestToListRow(guest: EventGuest): EventGuestListRow {
  const name = guest.name.trim();
  return {
    id: guest.id,
    name,
    initial: name.charAt(0).toUpperCase(),
  };
}

/** Going guests mapped for overview guest list UI. */
export function eventGuestListGoingRows(event: Event | null): EventGuestListRow[] {
  return eventGuestsGoing(event).map(mapGuestToListRow);
}

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
/** Overview: countdown hasta el inicio — true mientras `now <` instante de inicio. */
export function isEventDetailBeforeStartCountdownVisible(
  eventDateIso: string | null | undefined,
  now: Date,
): boolean {
  const d = eventDateIso?.trim() ?? '';
  if (!d) {
    return false;
  }
  return isBeforeEventStartInstant(d, now);
}

/** Evento {@link EventType.EventLive}: FAB de cámara (álbum). */
export function isEventDetailCameraFabVisible(
  eventDateIso: string | null | undefined,
  now: Date,
): boolean {
  const d = eventDateIso?.trim() ?? '';
  if (!d || Number.isNaN(Date.parse(d))) {
    return false;
  }
  return getEventType(d, now) === EventType.EventLive;
}

/** Anfitrión y {@link EventType.EventToStart}: pill invitados + botón compartir. */
export function isEventDetailOrganizerScheduledVisible(
  eventDateIso: string | null | undefined,
  isOrganizer: boolean,
  now: Date,
): boolean {
  if (!isOrganizer) {
    return false;
  }
  const trimmed = eventDateIso?.trim() ?? '';
  if (!trimmed || Number.isNaN(Date.parse(trimmed))) {
    return false;
  }
  return getEventType(trimmed, now) === EventType.EventToStart;
}

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
export function hostsLineForDetailView(event: Event | null): string {
  return (event?.hosts ?? [])
    .map((host) => host.name?.trim() ?? '')
    .filter((name) => name.length > 0)
    .join(', ');
}

export function organizerParticipantRows(event: Event | null): EventDetailParticipantRow[] {
  const confirmed = eventGuestsGoing(event)
    .map((guest, index) => ({
      id: `confirmed-${guest.id}-${index}`,
      name: guest.name.trim(),
      status: 'confirmed' as const,
    }))
    .filter((row) => row.name.length > 0);

  const pending = eventGuestsNotGoing(event)
    .map((guest, index) => ({
      id: `pending-${guest.id}-${index}`,
      name: guest.name.trim(),
      status: 'pending' as const,
    }))
    .filter((row) => row.name.length > 0);

  return [...confirmed, ...pending];
}
