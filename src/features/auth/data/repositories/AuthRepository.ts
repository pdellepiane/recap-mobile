import { authUserPaths } from '@/src/core/api/paths';
import type {
  ApiAuthUser,
  LoginCodeSuccessResponse,
  LogoutSuccessResponse,
  RequestLoginCodeResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { setAuthAccessToken } from '@/src/core/http/authSession';
import type { AppMemberRole, User } from '@/src/domain/entities';

function toDomainUser(remote: ApiAuthUser): User {
  const parts = [remote.firstname, remote.lastname].filter(Boolean);
  const name = parts.length > 0 ? parts.join(' ') : remote.email;
  const role: AppMemberRole = 'assistant';
  return {
    id: String(remote.id),
    email: remote.email,
    name,
    role,
  };
}

/** Calls real `/api-web/user/*` endpoints; maps {@link ApiAuthUser} to domain {@link User}. */
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
    setAuthAccessToken(res.data.user.credentials.access_token);
    return toDomainUser(res.data.user);
  }

  async logout(): Promise<void> {
    await this.http.post<LogoutSuccessResponse>(authUserPaths.logout, {}, { auth: 'bearer' });
    setAuthAccessToken(null);
  }
}
