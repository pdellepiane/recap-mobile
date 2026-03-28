import type { User } from '@/src/domain/entities';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'recap_auth_access_token';
const USER_JSON_KEY = 'recap_auth_user_json';

/**
 * Returns the stored JWT only (no user JSON). Used for `Authorization: Bearer` when the
 * in-memory token in `authSession` is unset.
 */
export async function getPersistedAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function loadPersistedSession(): Promise<{ token: string; user: User } | null> {
  const [token, userJson] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_JSON_KEY),
  ]);
  if (!token || !userJson) {
    return null;
  }
  try {
    const user = JSON.parse(userJson) as User;
    if (!user?.id || !user?.email) {
      return null;
    }
    return { token, user };
  } catch {
    return null;
  }
}

export async function persistSessionSnapshot(token: string, user: User): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_JSON_KEY, JSON.stringify(user)),
  ]);
}

export async function clearPersistedSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_JSON_KEY),
  ]);
}
