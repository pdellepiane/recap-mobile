import { FetchHttpClient } from '@/src/core/http/FetchHttpClient';
import { MockHttpClient } from '@/src/core/http/MockHttpClient';
import { getAuthAccessToken } from '@/src/core/http/authSession';
import { getPersistedAccessToken } from '@/src/features/auth/data/sessionStorage';
import { AuthRepository } from '@/src/features/auth/data/repositories/AuthRepository';

/**
 * Email OTP + JWT + logout always hit the real API (`EXPO_PUBLIC_API_BASE_URL`).
 * Profile comes from the auth session; events stay on {@link MockHttpClient} until wired.
 */
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://dev.api.recap.sinenvolturas.com';

/**
 * Bearer token for authenticated API calls: prefers in-memory JWT, then SecureStore
 * so logout (and future bearer endpoints) still send the stored token after a cold start.
 */
async function authAccessTokenForRequests(): Promise<string | null> {
  const fromMemory = getAuthAccessToken()?.trim();
  if (fromMemory) {
    return fromMemory;
  }
  const fromStore = await getPersistedAccessToken();
  return fromStore?.trim() ?? null;
}

const authHttp = new FetchHttpClient(apiBaseUrl, { getAccessToken: authAccessTokenForRequests });

export const authRepository = new AuthRepository(authHttp);
