import type { Event } from '@/src/domain/entities';

/**
 * Splits hosted home events (“Mis eventos”) into upcoming vs past using {@link Event.date}
 * (ISO datetime from the API). Unparseable dates are treated as upcoming.
 */
export function partitionHostEventsByDateTime(
  hostEvents: Event[],
  now: Date = new Date(),
): { upcoming: Event[]; past: Event[] } {
  const nowMs = now.getTime();
  const upcoming: Event[] = [];
  const past: Event[] = [];

  for (const e of hostEvents) {
    const ms = Date.parse(e.date);
    if (Number.isNaN(ms)) {
      upcoming.push(e);
      continue;
    }
    if (ms < nowMs) {
      past.push(e);
    } else {
      upcoming.push(e);
    }
  }

  past.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  upcoming.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return { upcoming, past };
}
