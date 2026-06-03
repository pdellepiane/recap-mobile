import { showUserToast } from './userToast';

/** Brief non-blocking feedback toast (iOS and Android). */
export function showShortUserMessage(message: string): void {
  showUserToast(message);
}
