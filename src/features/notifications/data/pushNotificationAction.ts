function parseJsonRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Reads `action` from a push notification `data` payload. */
export function actionFromPushNotificationData(data: unknown): string | null {
  if (typeof data === 'string') {
    return actionFromPushNotificationData(parseJsonRecord(data));
  }

  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  const action = record.action;
  if (typeof action === 'string' && action.trim()) {
    return action.trim();
  }

  const nested = parseJsonRecord(record.notification);
  if (nested && typeof nested.action === 'string' && nested.action.trim()) {
    return nested.action.trim();
  }

  return null;
}
