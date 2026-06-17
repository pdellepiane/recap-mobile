import { userPaths } from '@/src/core/api/paths';
import type {
  DeletePushTokenResponse,
  NotificationsListResponse,
  RegisterPushTokenResponse,
} from '@/src/core/api/types/notifications';
import type { PushDeviceType } from '@/src/core/notifications/pushDeviceType';
import type { FetchOpts } from '@/src/core/http/FetchOpts';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { notificationFromApiItem } from '@/src/features/notifications/data/notificationFromApi';
import type { NotificationItem } from '@/src/features/notifications/data/notificationItem';

export type FetchNotificationsParams = {
  page?: number;
  unreadOnly?: boolean;
};

export type FetchNotificationsResult = {
  items: NotificationItem[];
  hasMore: boolean;
  currentPage: number;
};

export class NotificationRepository {
  constructor(private readonly http: HttpClient) {}

  /** POST /api/user/push-token — safe to call on every app launch while authenticated. */
  async registerPushToken(token: string, deviceType: PushDeviceType): Promise<void> {
    const res = await this.http.post<RegisterPushTokenResponse>(
      userPaths.pushToken,
      { token, device_type: deviceType },
      { auth: 'bearer' },
    );
    if (!res.status) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'Push token registration failed',
      );
    }
  }

  /** DELETE /api/user/push-token — call on logout or when push permission is revoked. */
  async deletePushToken(opts?: FetchOpts): Promise<void> {
    const res = await this.http.delete<DeletePushTokenResponse>(userPaths.pushToken, {
      auth: 'bearer',
      ...opts,
    });
    if (!res.status) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'Push token removal failed',
      );
    }
  }

  /** GET /api/user/notifications — newest first. */
  async fetchNotifications(
    params: FetchNotificationsParams = {},
    opts?: FetchOpts,
  ): Promise<FetchNotificationsResult> {
    const search = new URLSearchParams();
    if (params.page != null && params.page > 0) {
      search.set('page', String(params.page));
    }
    if (params.unreadOnly) {
      search.set('unread_only', '1');
    }
    const query = search.toString();
    const path = query ? `${userPaths.notifications}?${query}` : userPaths.notifications;

    const res = await this.http.get<NotificationsListResponse>(path, { auth: 'bearer', ...opts });
    if (!res.status || !res.data) {
      throw new Error(
        typeof res.error === 'string' && res.error.trim() ? res.error : 'Notifications load failed',
      );
    }

    return {
      items: res.data.items.map(notificationFromApiItem),
      hasMore: res.data.has_more,
      currentPage: res.data.current_page,
    };
  }
}
