import { EventType } from '@/src/core/api';
import {
  isBeforeEventStartInstant,
  isDuringEventStartPlus24hWindow,
  isSameEventCalendarDayBeforeStartInstant,
} from '@/src/features/home/presentation/components/utils/eventCalendar';

const MONTHS_ES = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
] as const;

const DATE_BADGE_FALLBACK = { day: 'TBD', month: '' } as const;

/** Parses ISO datetimes or `YYYY-MM-DD` into day + short Spanish month for the date badge. */
export function eventDateBadgeParts(isoDate: string | null | undefined): { day: string; month: string } {
  const raw = isoDate?.trim() ?? '';
  if (!raw) {
    return DATE_BADGE_FALLBACK;
  }
  const ms = Date.parse(raw);
  if (!Number.isNaN(ms)) {
    const dt = new Date(ms);
    const month = MONTHS_ES[dt.getMonth()] ?? '---';
    return { day: String(dt.getDate()), month };
  }
  const [y, m, d] = raw.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) {
    return DATE_BADGE_FALLBACK;
  }
  const month = MONTHS_ES[m - 1] ?? '---';
  return { day: String(d), month };
}

/** Home carousel guest line: “+N invitados” for plural (pixel layout). */
export function formatCarouselGuestCountLabel(guestCount: number): string {
  if (guestCount <= 0) {
    return 'Sin invitados';
  }
  if (guestCount === 1) {
    return '1 invitado';
  }
  return `+${String(guestCount)} invitados`;
}

/**
 * Home carousel status: **during** [start, start+24h] → live; caso **(2)** mismo día y antes del
 * instante de inicio → {@link EventType.EventToStartToday}; otro futuro (aún `now < start`) →
 * {@link EventType.EventToStart}; después → finished.
 */
export function getEventType(isoDate: string | null | undefined, now: Date = new Date()): EventType {
  const raw = isoDate?.trim() ?? '';
  if (!raw) {
    return EventType.EventFinished;
  }
  if (isDuringEventStartPlus24hWindow(raw, now)) {
    return EventType.EventLive;
  }
  if (isBeforeEventStartInstant(raw, now)) {
    return isSameEventCalendarDayBeforeStartInstant(raw, now)
      ? EventType.EventToStartToday
      : EventType.EventToStart;
  }
  return EventType.EventFinished;
}

/** First word or full string for greetings like "Hola Paolo". */
export function firstNameFromDisplayName(name: string): string {
  const t = name.trim();
  if (!t) {
    return '';
  }
  return t.split(/\s+/)[0] ?? t;
}
