import { FetchHttpClient } from '@/src/core/http/FetchHttpClient';
import { MockHttpClient } from '@/src/core/http/MockHttpClient';
import { getAuthAccessToken } from '@/src/core/http/authSession';
import { AuthRepository } from '@/src/features/auth/data/repositories/AuthRepository';

/**
 * Email OTP + JWT + logout always hit the real API (`EXPO_PUBLIC_API_BASE_URL`).
 * Profile comes from the auth session; events stay on {@link MockHttpClient} until wired.
 */
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://dev.api.recap.sinenvolturas.com';

const authHttp = new FetchHttpClient(apiBaseUrl, { getAccessToken: getAuthAccessToken });

export const authRepository = new AuthRepository(authHttp);
