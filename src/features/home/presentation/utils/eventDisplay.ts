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

/** Parses ISO datetimes or `YYYY-MM-DD` into day + short Spanish month for the date badge. */
export function eventDateBadgeParts(isoDate: string): { day: string; month: string } {
  const ms = Date.parse(isoDate);
  if (!Number.isNaN(ms)) {
    const dt = new Date(ms);
    const month = MONTHS_ES[dt.getMonth()] ?? '---';
    return { day: String(dt.getDate()), month };
  }
  const [y, m, d] = isoDate.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) {
    return { day: '--', month: '---' };
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
export function getEventType(isoDate: string, now: Date = new Date()): EventType {
  if (isDuringEventStartPlus24hWindow(isoDate, now)) {
    return EventType.EventLive;
  }
  if (isBeforeEventStartInstant(isoDate, now)) {
    return isSameEventCalendarDayBeforeStartInstant(isoDate, now)
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
