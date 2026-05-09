import type { Event } from '@/src/domain/entities';
import { isAfterEventStartPlus24hWindow } from '@/src/features/home/presentation/components/utils/eventCalendar';

/**
 * Partitions home feed lists:
 * - **Mis eventos**: hosted rows that are not yet past ({@link isAfterEventStartPlus24hWindow}).
 * - **Planes**: guest rows still within the post-start +24h window (same “not past” rule).
 * - **Mis eventos pasados**: every hosted or guest event whose start was more than 24h ago (deduped by id; host payload wins on overlap).
 *
 * Unparseable `Event.date` stays in Mis eventos / Planes (not moved to past).
 */
export function partitionHomeFeedEvents(
  hostEvents: Event[],
  guestEvents: Event[],
  now: Date = new Date(),
): { myEvents: Event[]; plans: Event[]; pastEvents: Event[] } {
  const myEvents: Event[] = [];
  for (const e of hostEvents) {
    const ms = Date.parse(e.date);
    if (Number.isNaN(ms)) {
      myEvents.push(e);
      continue;
    }
    if (!isAfterEventStartPlus24hWindow(e.date, now)) {
      myEvents.push(e);
    }
  }

  const plans: Event[] = [];
  for (const e of guestEvents) {
    const ms = Date.parse(e.date);
    if (Number.isNaN(ms)) {
      plans.push(e);
      continue;
    }
    if (!isAfterEventStartPlus24hWindow(e.date, now)) {
      plans.push(e);
    }
  }

  const pastById = new Map<string, Event>();
  for (const e of hostEvents) {
    const ms = Date.parse(e.date);
    if (!Number.isNaN(ms) && isAfterEventStartPlus24hWindow(e.date, now)) {
      pastById.set(e.id, e);
    }
  }
  for (const e of guestEvents) {
    const ms = Date.parse(e.date);
    if (!Number.isNaN(ms) && isAfterEventStartPlus24hWindow(e.date, now) && !pastById.has(e.id)) {
      pastById.set(e.id, e);
    }
  }

  const pastEvents = [...pastById.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  myEvents.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return { myEvents, plans, pastEvents };
}
