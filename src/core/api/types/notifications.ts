/** POST /api/user/push-token */
export type RegisterPushTokenBody = {
  token: string;
  device_type: 'ios' | 'android' | 'unknown';
};

export type RegisterPushTokenResponse = {
  status: boolean;
  error?: string | null;
  errors?: unknown;
};

/** DELETE /api/user/push-token */
export type DeletePushTokenResponse = {
  status: boolean;
  error?: string | null;
  errors?: unknown;
};

/** Guest notifications */
export type GuestNotificationType =
  | 'media_liked'
  | 'challenge_added'
  | 'challenge_deadline'
  | 'ranking_position_changed'
  | 'event_started'
  | 'event_starting_soon'
  | 'event_recap_active';

/** Host notifications */
export type HostNotificationType =
  | 'media_uploaded'
  | 'new_guest_registered'
  | 'challenge_answered'
  | 'attendance_confirmed'
  | 'challenge_reminder';

export type NotificationType = GuestNotificationType | HostNotificationType;

export type NotificationApiActorType = 'guest' | 'user';

export type NotificationApiActor = {
  type: NotificationApiActorType;
  id: number;
  name: string;
  avatar: string | null;
};

export type NotificationApiNotifiableEvent = {
  type: 'event';
  id: number;
  name: string;
  slug: string;
};

export type NotificationApiNotifiableEventMedia = {
  type: 'event_media';
  id: number;
  path: string;
  event_id: number;
};

export type NotificationApiNotifiableEventChallenge = {
  type: 'event_challenge';
  id: number;
  title: string;
  event_id: number;
};

export type NotificationApiNotifiable =
  | NotificationApiNotifiableEvent
  | NotificationApiNotifiableEventMedia
  | NotificationApiNotifiableEventChallenge;

/** Extra payload — e.g. `ranking_position_changed` uses `position`. */
export type NotificationApiData = {
  position?: number;
  [key: string]: unknown;
} | null;

export type NotificationApiItem = {
  id: number;
  type: NotificationType | string;
  icon: string | null;
  subject: string | null;
  body: string | null;
  action: string | null;
  action_label: string | null;
  status: string | null;
  is_read: boolean;
  actor: NotificationApiActor | null;
  notifiable: NotificationApiNotifiable | null;
  data: NotificationApiData;
  event_id: number | null;
  created_at: string;
};

export type NotificationsListPayload = {
  items: NotificationApiItem[];
  total: number;
  per_page: number;
  current_page: number;
  has_more: boolean;
};

/** GET /api/user/notifications */
export type NotificationsListResponse = {
  status: boolean;
  data: NotificationsListPayload;
  error?: string | null;
  errors?: unknown;
};
