import { authUserPaths, userPaths } from '@/src/core/api/paths';
import type {
  CurrentUserMeResponse,
  LoginCodeSuccessResponse,
  LogoutSuccessResponse,
  RequestLoginCodeResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { setAuthAccessToken } from '@/src/core/http/authSession';
import type { User } from '@/src/domain/entities';
import { userFromApiPayload } from '@/src/features/auth/data/userFromApi';

/** Maps API auth payloads to domain {@link User}. */
export class AuthRepository {
  constructor(private readonly http: HttpClient) {}

  requestLoginCode(email: string): Promise<RequestLoginCodeResponse> {
    return this.http.post<RequestLoginCodeResponse>(
      authUserPaths.requestLoginCode,
      { email },
      { auth: 'none' },
    );
  }

  async loginWithCode(email: string, code: string): Promise<User> {
    const res = await this.http.post<LoginCodeSuccessResponse>(
      authUserPaths.loginCode,
      { email, code },
      { auth: 'none' },
    );
    if (!res.status) {
      throw new Error('Verification failed');
    }
    const token = res.token?.trim() ?? '';
    if (!token) {
      throw new Error('No access token in login response');
    }
    setAuthAccessToken(token);
    return userFromApiPayload(res.user);
  }

  /** GET /api/user/me — requires Bearer token. */
  async fetchCurrentUser(): Promise<User> {
    const res = await this.http.get<CurrentUserMeResponse>(userPaths.me, { auth: 'bearer' });
    if (!res.status || !res.data) {
      throw new Error(typeof res.error === 'string' && res.error.trim() ? res.error : 'User load failed');
    }
    return userFromApiPayload(res.data);
  }

  async logout(): Promise<void> {
    await this.http.post<LogoutSuccessResponse>(authUserPaths.logout, {}, { auth: 'bearer' });
    setAuthAccessToken(null);
  }
}
