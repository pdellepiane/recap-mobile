import type { Event } from '@/src/domain/entities';
import { isEventLocalCalendarDayBeforeToday } from '@/src/features/events/presentation/utils/eventCalendar';

/**
 * Splits hosted home events (“Mis eventos”) into upcoming vs past using {@link Event.date}
 * (ISO datetime from the API). **Past** means the event’s **local calendar day** is before today’s
 * (so an event later today stays in Mis eventos until midnight). Unparseable dates are treated as upcoming.
 */
export function partitionHostEventsByDateTime(
  hostEvents: Event[],
  now: Date = new Date(),
): { upcoming: Event[]; past: Event[] } {
  const upcoming: Event[] = [];
  const past: Event[] = [];

  for (const e of hostEvents) {
    const ms = Date.parse(e.date);
    if (Number.isNaN(ms)) {
      upcoming.push(e);
      continue;
    }
    if (isEventLocalCalendarDayBeforeToday(e.date, now)) {
      past.push(e);
    } else {
      upcoming.push(e);
    }
  }

  past.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  upcoming.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return { upcoming, past };
}
