import { authUserPaths } from '@/src/core/api/paths';
import type {
  LoginCodeSuccessResponse,
  LoginCodeUserPayload,
  LogoutSuccessResponse,
  RequestLoginCodeResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { setAuthAccessToken } from '@/src/core/http/authSession';
import type { AppMemberRole, User } from '@/src/domain/entities';

function toDomainUser(remote: LoginCodeUserPayload): User {
  const parts = [remote.firstname, remote.lastname].filter(
    (p): p is string => typeof p === 'string' && p.trim().length > 0,
  );
  const fullNameTrimmed = remote.full_name.trim();
  const name =
    parts.length > 0
      ? parts.join(' ')
      : fullNameTrimmed.length > 0 && fullNameTrimmed !== '-'
        ? fullNameTrimmed
        : remote.email;
  const role: AppMemberRole = 'assistant';
  return {
    id: String(remote.id),
    email: remote.email,
    name,
    role,
  };
}

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
    return toDomainUser(res.user);
  }

  async logout(): Promise<void> {
    await this.http.post<LogoutSuccessResponse>(authUserPaths.logout, {}, { auth: 'bearer' });
    setAuthAccessToken(null);
  }
}
