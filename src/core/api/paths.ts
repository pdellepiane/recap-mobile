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
