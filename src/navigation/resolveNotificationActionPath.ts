import { routePaths } from './routes';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

function isSafeAppActionPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('://');
}

/**
 * Maps notification `action` paths from API payloads to Expo Router hrefs.
 * Only paths emitted by backend notification types are supported.
 *
 * - `/events/:eventId` — event_started, event_starting_soon, new_guest_registered, attendance_confirmed
 * - `/events/:eventId/ranking` — ranking_position_changed
 * - `/events/:eventId/media` — event_recap_active
 * - `/events/:eventId/media/:mediaId` — media_liked, media_uploaded
 * - `/events/:eventId/challenges/:challengeId` — challenge_added, challenge_deadline, challenge_answered, challenge_reminder
 */
export function resolveNotificationActionPath(action: string): string | null {
  const path = action.trim();
  if (!path || !isSafeAppActionPath(path)) {
    return null;
  }

  const eventsMatch = path.match(/^\/events\/(\d+)(?:\/(.*))?$/);
  if (!eventsMatch) {
    return null;
  }

  const eventId = eventsMatch[1];
  const subPath = eventsMatch[2]?.replace(/\/$/, '') ?? '';

  if (!subPath) {
    return routePaths.eventDetail(eventId);
  }

  if (subPath === 'ranking') {
    return routePaths.eventDetail(eventId, EventDetailTab.Ranking);
  }

  if (subPath === 'media') {
    return routePaths.eventDetail(eventId, EventDetailTab.Album);
  }

  const mediaItemMatch = subPath.match(/^media\/(\d+)$/);
  if (mediaItemMatch) {
    return routePaths.eventDetailOpenAlbumPhoto(eventId, mediaItemMatch[1]);
  }

  const challengeItemMatch = subPath.match(/^challenges\/(\d+)$/);
  if (challengeItemMatch) {
    return routePaths.eventDetailOpenChallenge(eventId, challengeItemMatch[1]);
  }

  return null;
}
