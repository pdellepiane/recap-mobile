/** Row from GET /api/events/:id/media. */
export type EventMediaApiItem = {
  id: number;
  type: string;
  path: string;
  event_id: number;
  event_challenge_answer_photo_id?: number | null;
  /** API may return a number or a numeric string. */
  likes_count?: number | string | null;
  liked_by_me?: boolean;
  created_at: string;
  updated_at: string;
};

export type EventMediaListResponse = {
  data: EventMediaApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** POST /api/events/:id/media body. */
export type EventMediaPostBody = {
  type: string;
  path: string;
  event_challenge_answer_photo_id?: number | null;
};

/** POST /api/events/:id/media response envelope. */
export type EventMediaPostResponse = {
  status: boolean;
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
