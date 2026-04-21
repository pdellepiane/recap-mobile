/**
 * Wire types for POST /api/auth/* (email OTP login, JWT, logout).
 */

export type RequestLoginCodeBody = {
  email: string;
};

export type RequestLoginCodeResponse = {
  status: boolean;
  message: string;
};

export type LoginCodeBody = {
  email: string;
  /** 6-digit numeric string */
  code: string;
};

export type LoginCodeLanguagePayload = {
  id: number;
  code: string;
  region: string;
  locale: string;
  name: string;
};

/** {@link AuthUserResource} from POST /api/auth/login-code. */
export type LoginCodeUserPayload = {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  full_name: string;
  full_phone: string;
  language_id: number | null;
  language: LoginCodeLanguagePayload;
  created_at: string | null;
  updated_at: string | null;
};

/** POST /api/auth/login-code success body (`status` + `user` + JWT fields). */
export type LoginCodeSuccessResponse = {
  status: boolean;
  user: LoginCodeUserPayload;
  token: string | null;
  token_type: string;
  expires_in: number;
};

export type LogoutSuccessResponse = {
  message: string;
};

export type ValidationErrorResponse = {
  status: boolean;
  errors: Record<string, string[] | string>;
};

export type SimpleStatusErrorResponse = {
  status: boolean;
  error: string;
};

export type LogoutUnauthorizedResponse = {
  message: string;
};

export type ApiErrorBody =
  | ValidationErrorResponse
  | SimpleStatusErrorResponse
  | LogoutUnauthorizedResponse
  | Record<string, unknown>;

/** Guest row nested under GET /api/home/host-events and /api/home/guest-events event payloads. */
export type HomeEventGuestItem = {
  id: number;
  name: string;
  email: string;
  full_phone: string;
  has_responded: number;
  will_attend: number;
  has_couple: number;
  response_date: string;
  language_id: number;
  language: LoginCodeLanguagePayload;
  created_at: string;
  updated_at: string;
};

/** Single event row from GET /api/home/host-events or /api/home/guest-events. */
export type HomeEventItem = {
  id: number;
  slug: string;
  name: string;
  type: string;
  datetime: string;
  with_time: number;
  stage: string;
  city: string;
  location: string;
  /** Hero/cover image URL (same role as {@link HomeBannerItem.cover}). */
  cover?: string | null;
  guests: HomeEventGuestItem[];
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type HomeEventsListResponse = {
  data: HomeEventItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** Home banner carousel variant from GET /api/home/banners (drives slider layout in the app). */
export enum HomeBannerType {
  EventToStart = 'event_to_start',
  EventLive = 'event_live',
  EventFinished = 'event_finished',
  NoEvent = 'no_event',
}

/** Row from GET /api/home/banners (slider cards; `banner_type` drives layout). */
export type HomeBannerItem = {
  id: number;
  banner_type: HomeBannerType;
  slug: string;
  name: string;
  type: string;
  datetime: string;
  with_time: number;
  cover: string;
  guest_images: unknown[];
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type HomeBannersListResponse = {
  data: HomeBannerItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** GET /api/events/:id — full event resource. */
export type EventDetailData = {
  id: number;
  slug: string;
  name: string;
  hosts: string;
  guests: string;
  type: string;
  type_detail: string;
  datetime: string;
  with_time: number;
  stage: string;
  city: string;
  country_id: number;
  location: string;
  cover: string;
  is_visible: number;
  is_public: number;
  user_id: number;
  timezone: string;
  created_at: string;
  updated_at: string;
  guests_going: HomeEventGuestItem[];
};

export type EventDetailApiResponse = {
  data: EventDetailData;
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** Row from GET /api/events/:id/ranking. */
export type EventRankingApiItem = {
  id: number;
  name: string;
  lastname: string;
  points: number;
};

export type EventRankingListResponse = {
  data: EventRankingApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

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
  /** Often JSON: string[] or `{ text, is_correct }[]`. */
  options?: string | null;
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
