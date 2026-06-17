export const authUserPaths = {
  requestLoginCode: 'api/auth/request-login-code',
  loginCode: 'api/auth/login-code',
  logout: 'api/auth/logout',
} as const;

/** Authenticated user profile (Bearer). */
export const userPaths = {
  me: 'api/user/me',
  profile: 'api/user/profile',
  avatar: 'api/user/avatar',
  pushToken: 'api/user/push-token',
  notifications: 'api/user/notifications',
} as const;

export const homePaths = {
  hostEvents: 'api/home/host-events',
  guestEvents: 'api/home/guest-events',
  banners: 'api/home/banners',
} as const;

export const eventPaths = {
  /** GET /api/events/:id — full event payload (detail). */
  detail: (id: string | number) => `api/events/${encodeURIComponent(String(id))}`,
  /** GET /api/events/:id/ranking — guest points leaderboard. */
  ranking: (id: string | number) => `api/events/${encodeURIComponent(String(id))}/ranking`,
  /** GET /api/events/:id/challenges — event challenges for guests. */
  challenges: (id: string | number) => `api/events/${encodeURIComponent(String(id))}/challenges`,
  /** PUT /api/events/:id/challenges/:challengeId — update challenge (host creator). */
  challenge: (eventId: string | number, challengeId: string | number) =>
    `api/events/${encodeURIComponent(String(eventId))}/challenges/${encodeURIComponent(String(challengeId))}`,
  /** POST /api/events/:id/challenges/:challengeId/answers — guest challenge submission. */
  challengeAnswers: (eventId: string | number, challengeId: string | number) =>
    `api/events/${encodeURIComponent(String(eventId))}/challenges/${encodeURIComponent(String(challengeId))}/answers`,
  /** GET /api/events/:id/challenges/pending — whether the user has incomplete challenges (Bearer). */
  challengesPending: (id: string | number) =>
    `api/events/${encodeURIComponent(String(id))}/challenges/pending`,
  /** POST /api/events/:id/reactions — send a reaction (Bearer). */
  reactions: (id: string | number) => `api/events/${encodeURIComponent(String(id))}/reactions`,
  /** GET /api/events/:id/media — album / gallery items (Bearer). */
  media: (id: string | number) => `api/events/${encodeURIComponent(String(id))}/media`,
  /** POST /api/events/:id/media/:mediaId/likes — toggle/record like (Bearer). */
  mediaLike: (eventId: string | number, mediaId: string | number) =>
    `api/events/${encodeURIComponent(String(eventId))}/media/${encodeURIComponent(String(mediaId))}/likes`,
  /** PATCH /api/events/:id/settings — event settings (Bearer). */
  settings: (id: string | number) => `api/events/${encodeURIComponent(String(id))}/settings`,
  /** GET /api/event-challenge-suggestions/questions — suggested quiz questions (Bearer). */
  challengeQuestionSuggestions: 'api/event-challenge-suggestions/questions',
  /** GET /api/event-challenge-suggestions/photos — suggested photo challenges (Bearer). */
  challengePhotoSuggestions: 'api/event-challenge-suggestions/photos',
} as const;
