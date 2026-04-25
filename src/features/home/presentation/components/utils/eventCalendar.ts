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

/**
 * “Día del evento en adelante”: the event’s local calendar day is today or already passed (not still in the future).
 * Used for guest ranking/challenges visibility and host ranking visibility.
 */
export function isEventCalendarDayTodayOrPast(isoDate: string, now: Date = new Date()): boolean {
  return !isEventCalendarDayStrictlyAfterToday(isoDate, now);
}

/**
 * Host: puede crear/editar desafíos hasta 1 minuto antes del inicio del evento (`datetime` ISO).
 */
export function canHostEditChallengesUntilOneMinuteBefore(
  isoDate: string,
  now: Date = new Date(),
): boolean {
  const startMs = Date.parse(isoDate);
  if (Number.isNaN(startMs)) {
    return false;
  }
  return now.getTime() <= startMs - 60_000;
}

const FLOATING_REACTION_WINDOW_MS = 48 * 60 * 60 * 1000;

/**
 * Ventana de reacciones del evento: desde la hora programada (`datetime` ISO) durante 48h
 * (día del evento + día siguiente en términos de ventana continua).
 */
export function isWithinEventReactionsWindow(isoDate: string, now: Date = new Date()): boolean {
  const startMs = Date.parse(isoDate);
  if (Number.isNaN(startMs)) {
    return false;
  }
  const t = now.getTime();
  return t >= startMs && t < startMs + FLOATING_REACTION_WINDOW_MS;
}
