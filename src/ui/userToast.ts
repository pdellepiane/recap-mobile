export type UserToastVariant = 'default' | 'success';

export type UserToastPayload = {
  id: number;
  message: string;
  variant: UserToastVariant;
};

const DEFAULT_DURATION_MS = 3500;

type Listener = (toast: UserToastPayload | null) => void;

const listeners = new Set<Listener>();
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function notify(toast: UserToastPayload | null) {
  listeners.forEach((listener) => listener(toast));
}

export function subscribeUserToast(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showUserToast(
  message: string,
  options?: { variant?: UserToastVariant; durationMs?: number },
): void {
  const trimmed = message.trim();
  if (!trimmed) {
    return;
  }

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  const variant = options?.variant ?? 'default';
  const durationMs = options?.durationMs ?? DEFAULT_DURATION_MS;

  notify({ id: Date.now(), message: trimmed, variant });
  hideTimer = setTimeout(() => {
    notify(null);
    hideTimer = null;
  }, durationMs);
}

export function showSuccessToast(message: string): void {
  showUserToast(message, { variant: 'success' });
}
