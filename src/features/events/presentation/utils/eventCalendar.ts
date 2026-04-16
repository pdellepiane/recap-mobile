/**
 * True when the event’s **local calendar day** is today or in the future (ignoring clock time).
 * Used for home feed partitioning; detail tabs use {@link isEventCalendarDayStrictlyAfterToday} for hosted future days.
 */
export function isEventCalendarDayTodayOrFuture(isoDate: string, now: Date = new Date()): boolean {
  const ms = Date.parse(isoDate);
  if (Number.isNaN(ms)) {
    return false;
  }
  const eventDay = new Date(ms);
  const today = new Date(now);
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDay.getTime() >= today.getTime();
}

/**
 * True when the event’s **local calendar day** is strictly **after** today’s (ignoring clock time).
 */
export function isEventCalendarDayStrictlyAfterToday(isoDate: string, now: Date = new Date()): boolean {
  const ms = Date.parse(isoDate);
  if (Number.isNaN(ms)) {
    return false;
  }
  const eventDay = new Date(ms);
  const today = new Date(now);
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDay.getTime() > today.getTime();
}

/**
 * True when the event’s **local calendar day** is the same as today’s (ignoring clock time).
 */
export function isEventCalendarDayToday(isoDate: string, now: Date = new Date()): boolean {
  const ms = Date.parse(isoDate);
  if (Number.isNaN(ms)) {
    return false;
  }
  const eventDay = new Date(ms);
  const today = new Date(now);
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDay.getTime() === today.getTime();
}

/**
 * True when the event’s **local calendar day** is strictly before today’s local calendar day.
 * Used so same-day events stay in “Mis eventos” until the day rolls over, not until the clock time passes.
 */
export function isEventLocalCalendarDayBeforeToday(isoDate: string, now: Date = new Date()): boolean {
  const ms = Date.parse(isoDate);
  if (Number.isNaN(ms)) {
    return false;
  }
  const eventDay = new Date(ms);
  const today = new Date(now);
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDay.getTime() < today.getTime();
}
