export const authUserPaths = {
  requestLoginCode: 'api/auth/request-login-code',
  loginCode: 'api/auth/login-code',
  logout: 'api/auth/logout',
} as const;

/** Authenticated user profile (Bearer). */
export const userPaths = {
  me: 'api/user/me',
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
  ranking: (id: string | number) =>
    `api/events/${encodeURIComponent(String(id))}/ranking`,
  /** GET /api/events/:id/challenges — event challenges for guests. */
  challenges: (id: string | number) =>
    `api/events/${encodeURIComponent(String(id))}/challenges`,
  /** POST /api/events/:id/reactions — send a reaction (Bearer). */
  reactions: (id: string | number) =>
    `api/events/${encodeURIComponent(String(id))}/reactions`,
  /** GET /api/events/:id/media — album / gallery items (Bearer). */
  media: (id: string | number) =>
    `api/events/${encodeURIComponent(String(id))}/media`,
} as const;
