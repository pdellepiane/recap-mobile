import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';
import { routePaths } from './routes';

function isSafeInAppPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('://');
}

/**
 * Maps notification `action` paths (API or in-app) to an Expo Router href.
 * Returns `null` when the action cannot be opened in the app.
 */
export function resolvePushActionToAppPath(action: string): string | null {
  const path = action.trim();
  if (!path || !isSafeInAppPath(path)) {
    return null;
  }

  if (path.startsWith('/event/')) {
    return path;
  }

  if (path === '/home' || path.startsWith('/home/')) {
    return path;
  }

  if (path === '/profile' || path.startsWith('/profile/')) {
    return path;
  }

  if (path.startsWith('/in-app-web')) {
    return path;
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

  if (subPath === 'media' || subPath.startsWith('media/')) {
    return routePaths.eventDetail(eventId, EventDetailTab.Album);
  }

  if (subPath === 'challenges' || subPath.startsWith('challenges/')) {
    return routePaths.eventDetail(eventId, EventDetailTab.Challenges);
  }

  return routePaths.eventDetail(eventId);
}
