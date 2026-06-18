import { enqueueNotificationAction } from '@/src/navigation/pendingNotificationAction';
import { resolveAppActionPath } from '@/src/navigation/resolveAppActionPath';
import { resolveActionPathFromDeepLink } from '@/src/navigation/resolveDeepLinkPath';
import { routePaths } from '@/src/navigation/routes';

type RedirectSystemPathOptions = {
  path: string;
  initial: boolean;
};

/**
 * Rewrites external native links before Expo Router resolves them.
 *
 * Examples:
 * - initial `recap://events/1/media/42` -> `/home`, then pushes Event Detail from queue.
 * - foreground `recap://events/1/media/42` -> `/event/1?tab=album&openAlbumPhotoId=42`
 */
export function redirectSystemPath({ path, initial }: RedirectSystemPathOptions): string {
  const actionPath = resolveActionPathFromDeepLink(path);
  const appActionPath = resolveAppActionPath(actionPath);

  // If the resolved path is not found, return the not found path.
  if (!appActionPath) {
    return actionPath.startsWith('/events/') ? routePaths.notFound : path;
  }

  /*
   * If the action path is initial and the action is enqueued, return the home path (queue the action)
   * so it can be redirected to the event detail screen when the app is ready.
   * Returning Home first avoids opening Event Detail as the root screen, which would break back/swipe navigation.
   */
  if (initial && enqueueNotificationAction(actionPath)) {
    return routePaths.home;
  }

  // Return the resolved path (event detail screen).
  return appActionPath;
}
