/**
 * Maps external links into app route paths.
 *
 * Supported public paths intentionally match backend notification actions:
 * - `recap://events/:eventId`
 * - `recap://events/:eventId/ranking`
 * - `recap://events/:eventId/media`
 * - `recap://events/:eventId/media/:mediaId`
 * - `recap://events/:eventId/challenges/:challengeId`
 */
export function resolveActionPathFromDeepLink(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Expo Router native-intent may pass custom scheme paths without a leading slash.
  if (trimmed.startsWith('events/')) {
    return `/${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    const pathname = url.pathname || '';
    const search = url.search || '';

    if (url.protocol === 'recap:') {
      const hostPrefix = url.hostname ? `/${url.hostname}` : '';
      return `${hostPrefix}${pathname}${search}`;
    }

    return `${pathname}${search}`;
  } catch {
    return trimmed;
  }
}
