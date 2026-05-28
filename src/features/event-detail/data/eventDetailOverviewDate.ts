/**
 * Copy for overview date row: long weekday + day + month, and 12h time like "04 : 00 pm".
 */
export function formatEventDetailOverviewDateLines(
  isoDate: string | null | undefined,
  language: string,
): { dateLine: string; timeLine: string | null } {
  const trimmed = isoDate?.trim() ?? '';
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) {
    return { dateLine: trimmed.length > 0 ? trimmed : '—', timeLine: null };
  }
  const d = new Date(ms);
  const locale = language.startsWith('es') ? 'es' : 'en';
  const dateLineRaw = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d);
  const dateLine = dateLineRaw.charAt(0).toUpperCase() + dateLineRaw.slice(1);

  let h = d.getHours();
  const mins = d.getMinutes();
  const isPm = h >= 12;
  const ampm = isPm ? 'pm' : 'am';
  h = h % 12;
  if (h === 0) {
    h = 12;
  }
  const timeLine = `${String(h).padStart(2, '0')} : ${String(mins).padStart(2, '0')} ${ampm}`;

  return { dateLine, timeLine };
}
