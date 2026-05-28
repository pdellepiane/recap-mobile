/**
 * Event timing from API `datetime` (ISO). **Four reusable UI buckets** (local timezone):
 *
 * 1. {@link isBeforeEventCalendarDay} — calendar days before the event day (no clock).
 * 2. {@link isSameEventCalendarDayBeforeStartInstant} — **on** the event’s calendar day, but **before** the start time.
 * 3. {@link isDuringEventStartPlus24hWindow} — from **start instant** through **start + 24h** (álbum, ventana “en vivo”).
 * 4. {@link isAfterEventStartPlus24hWindow} — strictly after **start + 24h** (e.g. “pasado”, fin ventana).
 *
 * Also: {@link isBeforeEventStartInstant} ⇔ (1) ∨ (2) ⇔ `now < start`.
 */

/** Ventana desde el instante de inicio hasta 24h después. */
export const EVENT_ALBUM_UPLOAD_WINDOW_AFTER_START_MS = 24 * 60 * 60 * 1000;

function parseEventStartMs(isoDate: string | null | undefined): number | null {
  const raw = isoDate?.trim() ?? '';
  if (!raw) {
    return null;
  }
  const ms = Date.parse(raw);
  return Number.isNaN(ms) ? null : ms;
}

function startOfLocalCalendarDayMs(utcMs: number): number {
  const d = new Date(utcMs);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function eventLocalDayStartMs(isoDate: string): number | null {
  const ms = parseEventStartMs(isoDate);
  return ms === null ? null : startOfLocalCalendarDayMs(ms);
}

function todayLocalDayStartMs(now: Date): number {
  return startOfLocalCalendarDayMs(now.getTime());
}

// ---------------------------------------------------------------------------
// (1) Before event calendar day only
// ---------------------------------------------------------------------------

/**
 * True when `now` is before the event calendar day (no clock).
 */
export function isBeforeEventCalendarDay(isoDate: string, now: Date = new Date()): boolean {
  const eventDay = eventLocalDayStartMs(isoDate);
  if (eventDay === null) {
    return false;
  }
  return todayLocalDayStartMs(now) < eventDay;
}

/**
 * True when `now` falls on the event’s **local calendar day** (medianoche a medianoche); no mira la hora.
 */
export function isEventCalendarDayToday(isoDate: string, now: Date = new Date()): boolean {
  const eventDay = eventLocalDayStartMs(isoDate);
  if (eventDay === null) {
    return false;
  }
  return eventDay === todayLocalDayStartMs(now);
}

// ---------------------------------------------------------------------------
// (2) Same calendar day as event, but before start instant (time-of-day)
// ---------------------------------------------------------------------------

/**
 * True when `now` is strictly before the event start instant (full `datetime`: día + hora + min + seg + ms).
 */
export function isBeforeEventStartInstant(isoDate: string, now: Date = new Date()): boolean {
  const startMs = parseEventStartMs(isoDate);
  if (startMs === null) {
    return false;
  }
  return now.getTime() < startMs;
}

/**
 * Caso **(2)**: mismo día de calendario local que el evento, y `now` **antes** de la hora:minuto:segundo
 * de inicio del `datetime` (equivale a {@link isEventCalendarDayToday} ∧ {@link isBeforeEventStartInstant}).
 */
export function isSameEventCalendarDayBeforeStartInstant(
  isoDate: string,
  now: Date = new Date(),
): boolean {
  return isEventCalendarDayToday(isoDate, now) && isBeforeEventStartInstant(isoDate, now);
}

// ---------------------------------------------------------------------------
// (3) During [start, start + 24h]
// ---------------------------------------------------------------------------
/**
 * True when `now` is during the event start plus 24h window (e.g. “en vivo”).
 */
export function isDuringEventStartPlus24hWindow(isoDate: string, now: Date = new Date()): boolean {
  const startMs = parseEventStartMs(isoDate);
  if (startMs === null) {
    return false;
  }
  const t = now.getTime();
  return t >= startMs && t <= startMs + EVENT_ALBUM_UPLOAD_WINDOW_AFTER_START_MS;
}

// ---------------------------------------------------------------------------
// (4) After start + 24h (strict)
// ---------------------------------------------------------------------------

/**
 * True when `now` is strictly after the 24h window (e.g. “Mis eventos pasados” cutoff).
 */
export function isAfterEventStartPlus24hWindow(isoDate: string, now: Date = new Date()): boolean {
  const startMs = parseEventStartMs(isoDate);
  if (startMs === null) {
    return false;
  }
  return now.getTime() > startMs + EVENT_ALBUM_UPLOAD_WINDOW_AFTER_START_MS;
}
