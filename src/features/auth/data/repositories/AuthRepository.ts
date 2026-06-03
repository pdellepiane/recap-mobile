import { authUserPaths, userPaths } from '@/src/core/api/paths';
import type {
  CurrentUserMeResponse,
  LoginCodeSuccessResponse,
  LogoutSuccessResponse,
  RequestLoginCodeResponse,
  UpdateUserProfileResponse,
  UploadUserAvatarResponse,
} from '@/src/core/api/types';
import type { FetchOpts } from '@/src/core/http/FetchOpts';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { setAuthAccessToken } from '@/src/core/http/authSession';
import type { User } from '@/src/domain/entities';
import { userFromApiPayload } from '@/src/features/auth/data/userFromApi';
import { buildUserAvatarFormData } from '@/src/features/profile/data/userAvatarUpload';

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
  async fetchCurrentUser(opts?: FetchOpts): Promise<User> {
    const res = await this.http.get<CurrentUserMeResponse>(userPaths.me, {
      auth: 'bearer',
      ...opts,
    });
    if (!res.status || !res.data) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'User load failed',
      );
    }
    return userFromApiPayload(res.data);
  }

  /** PATCH /api/user/profile — updates first and last name. */
  async updateProfile(firstname: string, lastname: string, opts?: FetchOpts): Promise<User> {
    const res = await this.http.patch<UpdateUserProfileResponse>(
      userPaths.profile,
      { firstname, lastname },
      { auth: 'bearer', ...opts },
    );
    if (!res.status) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'Profile update failed',
      );
    }
    if (!res.data) {
      return this.fetchCurrentUser(opts);
    }
    return userFromApiPayload(res.data);
  }

  /** POST /api/user/avatar — multipart field `avatar`. */
  async uploadAvatar(fileUri: string, opts?: FetchOpts): Promise<User> {
    const formData = buildUserAvatarFormData(fileUri);
    const res = await this.http.postFormData<UploadUserAvatarResponse>(userPaths.avatar, formData, {
      auth: 'bearer',
      ...opts,
    });
    if (!res.status) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'Avatar upload failed',
      );
    }
    const data = res.data;
    if (data && 'id' in data) {
      return userFromApiPayload(data);
    }
    return this.fetchCurrentUser(opts);
  }

  async logout(): Promise<void> {
    await this.http.post<LogoutSuccessResponse>(authUserPaths.logout, {}, { auth: 'bearer' });
    setAuthAccessToken(null);
  }
}
