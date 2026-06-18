/** Queued notification `action` for cold-start push taps (deferred until after bootstrap). */

let pendingAction: string | null = null;

/** Queue an API `action` path from a push tap. */
export function enqueueNotificationAction(action: string): boolean {
  const trimmed = action.trim();
  if (!trimmed) {
    return false;
  }
  pendingAction = trimmed;
  return true;
}

export function peekPendingNotificationAction(): string | null {
  return pendingAction;
}

export function takePendingNotificationAction(): string | null {
  const action = pendingAction;
  pendingAction = null;
  return action;
}
