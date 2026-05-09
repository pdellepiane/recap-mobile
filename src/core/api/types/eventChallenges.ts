/** Nested under GET /api/events/:id/challenges items when the guest has submitted an answer. */
export type EventChallengeGuestAnswerApi = {
  id?: string;
  guest_id?: string;
  event_challenge_option_id?: string;
  points?: string | number;
  photos?: string;
  created_at?: string;
  updated_at?: string;
};

/** Row from GET /api/events/:id/challenges. */
export type EventChallengeApiItem = {
  id: number;
  type: string;
  title: string;
  question: string;
  points: number;
  position: number;
  is_active: boolean;
  event_id: number;
  event_host_id: number;
  /** JSON string, or decoded array of strings / `{ option?, text?, is_correct }` (GET challenges). */
  options?: string | null | unknown[];
  /** Guest answers / submissions count (if API exposes it). */
  responses_count?: number;
  answers_count?: number;
  current_guest_answer?: EventChallengeGuestAnswerApi | null;
  created_at: string;
  updated_at: string;
};

export type EventChallengesListResponse = {
  data: EventChallengeApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** GET /api/events/:id/challenges/pending */
export type EventChallengesPendingData = {
  has_pending: boolean;
  pending_count?: number;
};

export type EventChallengesPendingResponse = {
  data: EventChallengesPendingData;
  status: boolean;
  errors: unknown;
  error: string | null;
};

export type EventChallengeOptionPostBody = {
  option: string;
  /** 1-based index per API validation (`position` ≥ 1). */
  position: number;
  points: number;
};

export type EventChallengePostBody = {
  /** API: `question` | `picture`. `points` defaults to 0 when omitted. */
  type: string;
  title: string;
  question: string;
  points: number;
  position: number;
  is_active: boolean;
  options?: EventChallengeOptionPostBody[];
  correct_option_index?: number;
};

export type EventChallengeCreateResponse = {
  data: EventChallengeApiItem;
  status: boolean;
  errors: unknown;
  error: string | null;
};
