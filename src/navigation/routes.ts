export const routePaths = {
  onboarding: '/onboarding',
  login: '/login',
  verifyCode: '/verify-code',
  home: '/home',
  profile: '/profile',
  eventDetail: (eventId: string) => `/event/${eventId}`,
} as const;

export const routeNames = {
  onboarding: 'Onboarding',
  login: 'Login',
  verifyCode: 'VerifyCode',
  home: 'Home',
  eventDetail: 'EventDetail',
  profile: 'Profile',
} as const;
