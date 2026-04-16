import { FetchHttpClient } from '@/src/core/http/FetchHttpClient';
import { MockHttpClient } from '@/src/core/http/MockHttpClient';
import { getAuthAccessToken } from '@/src/core/http/authSession';
import { AuthRepository } from '@/src/features/auth/data/repositories/AuthRepository';
import { getPersistedAccessToken } from '@/src/features/auth/data/sessionStorage';
import { EventRepository } from '@/src/features/events/data/repositories/EventRepository';

/**
 * Email OTP + JWT + logout and authenticated home event lists hit the real API (`EXPO_PUBLIC_API_BASE_URL`).
 * Event detail merges {@link EventRepository.getLocalEventById} (home cache) with GET `api/events/:id`
 * (or mock when `EXPO_PUBLIC_MOCK_EVENT_DETAIL_API` / home mock flags apply). Legacy `evt-*` ids still use {@link MockHttpClient}.
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

const eventsApi = new FetchHttpClient(apiBaseUrl, { getAccessToken: authAccessTokenForRequests });
const eventsMock = new MockHttpClient();

export const authRepository = new AuthRepository(authHttp);
export const eventRepository = new EventRepository(eventsApi, eventsMock);
