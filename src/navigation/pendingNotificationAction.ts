/** Queued notification/deeplink action path for cold-start navigation after bootstrap. */

let pendingAction: string | null = null;

/** Queue an `action` path from a push tap or initial deeplink. */
export function enqueueNotificationAction(actionPath: string): boolean {
  if (!actionPath) {
    return false;
  }
  pendingAction = actionPath;
  return true;
}

/** Get the pending notification action without removing it from the queue. */
export function peekPendingNotificationAction(): string | null {
  return pendingAction;
}

/** Remove and return the pending notification action from the queue. */
export function takePendingNotificationAction(): string | null {
  const action = pendingAction;
  pendingAction = null;
  return action;
}
