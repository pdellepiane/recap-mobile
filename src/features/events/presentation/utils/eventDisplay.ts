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

/** Parses `YYYY-MM-DD` into day + short Spanish month for the date badge. */
export function eventDateBadgeParts(isoDate: string): { day: string; month: string } {
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

/** First word or full string for greetings like "Hola Paolo". */
export function firstNameFromDisplayName(name: string): string {
  const t = name.trim();
  if (!t) {
    return '';
  }
  return t.split(/\s+/)[0] ?? t;
}
