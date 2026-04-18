import {
  isEventCalendarDayStrictlyAfterToday,
  isEventCalendarDayToday,
} from '@/src/features/events/presentation/utils/eventCalendar';

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

/** Short label for home cards (“N invitados” / “Sin invitados”). */
export function formatEventGuestCountLabel(guestCount: number): string {
  if (guestCount <= 0) {
    return 'Sin invitados';
  }
  if (guestCount === 1) {
    return '1 invitado';
  }
  return `${String(guestCount)} invitados`;
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

export type HomeCarouselScheduleKind = 'live' | 'scheduled';

/**
 * Home carousel status by **local calendar day**: today → live, strictly future → scheduled, past → none.
 */
export function getHomeCarouselScheduleKind(
  isoDate: string,
  now: Date = new Date(),
): HomeCarouselScheduleKind | null {
  if (isEventCalendarDayToday(isoDate, now)) {
    return 'live';
  }
  if (isEventCalendarDayStrictlyAfterToday(isoDate, now)) {
    return 'scheduled';
  }
  return null;
}

/** First word or full string for greetings like "Hola Paolo". */
export function firstNameFromDisplayName(name: string): string {
  const t = name.trim();
  if (!t) {
    return '';
  }
  return t.split(/\s+/)[0] ?? t;
}
