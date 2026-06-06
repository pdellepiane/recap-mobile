import { InteractionManager } from 'react-native';

export type UserToastVariant = 'default' | 'success';

export type UserToastPayload = {
  id: number;
  message: string;
  variant: UserToastVariant;
};

const DEFAULT_DURATION_MS = 3500;

type Listener = () => void;

const listeners = new Set<Listener>();
let toastSnapshot: UserToastPayload | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function getUserToastSnapshot(): UserToastPayload | null {
  return toastSnapshot;
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

  toastSnapshot = { id: Date.now(), message: trimmed, variant };
  emitChange();

  hideTimer = setTimeout(() => {
    toastSnapshot = null;
    emitChange();
    hideTimer = null;
  }, durationMs);
}

export function showSuccessToast(message: string): void {
  showUserToast(message, { variant: 'success' });
}

/** Show toast after navigation transitions settle (safe to call right after `goBack()`). */
export function showSuccessToastAfterNavigation(message: string): void {
  InteractionManager.runAfterInteractions(() => {
    showSuccessToast(message);
  });
}
