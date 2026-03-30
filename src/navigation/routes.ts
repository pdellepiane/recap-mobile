export const routePaths = {
  onboarding: '/onboarding',
  login: '/login',
  verifyCode: '/verify-code',
  home: '/home',
  profile: '/home/profile',
  eventDetail: (eventId: string, tab?: 'detalle' | 'challenges' | 'ranking' | 'album') =>
    tab ? `/event/${eventId}?tab=${encodeURIComponent(tab)}` : `/event/${eventId}`,
} as const;

export const routeNames = {
  onboarding: 'Onboarding',
  login: 'Login',
  verifyCode: 'VerifyCode',
  home: 'Home',
  eventDetail: 'EventDetail',
  profile: 'Profile',
} as const;
