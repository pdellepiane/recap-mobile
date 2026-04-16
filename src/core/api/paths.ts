export const authUserPaths = {
  requestLoginCode: 'api/auth/request-login-code',
  loginCode: 'api/auth/login-code',
  logout: 'api/auth/logout',
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
} as const;
