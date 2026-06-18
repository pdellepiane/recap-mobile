/** Row from GET /api/events/:id/media. */
export type EventMediaApiGuest = {
  id: number;
  name: string;
};

export type EventMediaApiItem = {
  id: number;
  type: string;
  path: string;
  event_id: number;
  guest_id?: number;
  guest?: EventMediaApiGuest | null;
  event_challenge_answer_photo_id?: number | null;
  /** API may return a number or a numeric string. */
  likes_count?: number | string | null;
  liked_by_me?: boolean;
  created_at: string;
  updated_at: string;
};

export type EventMediaListPayload = {
  items: EventMediaApiItem[];
  total: number;
  per_page: number;
  current_page: number;
  has_more: boolean;
};

export type EventMediaListResponse = {
  data: EventMediaListPayload;
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** POST /api/events/:id/media multipart fields. */
export type EventMediaUploadParams = {
  /** Local file URI (React Native / Expo asset). */
  fileUri: string;
  mimeType?: string;
  fileName?: string;
  event_challenge_answer_photo_id?: number;
};

/** @deprecated Use {@link EventMediaUploadParams} — API now expects multipart/form-data. */
export type EventMediaPostBody = {
  type: string;
  path: string;
  event_challenge_answer_photo_id?: number | null;
};

/** POST /api/events/:id/media response envelope. */
export type EventMediaPostData = {
  id?: number;
  path?: string;
  type?: string;
  event_id?: number;
};

export type EventMediaPostResponse = {
  status: boolean;
  data?: EventMediaPostData;
  errors?: unknown;
  error?: string | null;
  message?: string;
};

/** POST /api/events/:id/media/:mediaId/likes */
export type EventMediaLikeData = {
  liked: boolean;
  likes_count: number | string;
};

export type EventMediaLikeResponse = {
  data: EventMediaLikeData;
  status: boolean;
  errors: unknown;
  error: string | null;
};
