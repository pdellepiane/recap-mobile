export const routePaths = {
  onboarding: '/onboarding',
  login: '/login',
  verifyCode: '/verify-code',
  home: '/home',
  profile: '/home/profile',
  /** In-app WebView modal; `url` must be a full `https` URL (encoded). */
  homeWeb: (url: string) => `/in-app-web?url=${encodeURIComponent(url)}`,
  eventDetail: (eventId: string, tab?: 'detalle' | 'challenges' | 'ranking' | 'album') =>
    tab ? `/event/${eventId}?tab=${encodeURIComponent(tab)}` : `/event/${eventId}`,
  eventDetailChallengesCompleted: (eventId: string, completedChallengeId: string, points: number) =>
    `/event/${eventId}?tab=challenges&completedChallengeId=${encodeURIComponent(completedChallengeId)}&points=${encodeURIComponent(String(points))}`,
  eventDetailTabWithCompletedChallenge: (
    eventId: string,
    tab: 'detalle' | 'challenges' | 'ranking' | 'album',
    completedChallengeId: string,
    points: number,
  ) =>
    `/event/${eventId}?tab=${encodeURIComponent(tab)}&completedChallengeId=${encodeURIComponent(completedChallengeId)}&points=${encodeURIComponent(String(points))}`,
  eventMap: (eventId: string) => `/event/${eventId}/map`,
  eventStories: (eventId: string) => `/event/${eventId}/stories`,
  eventChallengeQuiz: (eventId: string, challengeId: string, challengeNumber: number) =>
    `/event/${eventId}/challenge-quiz?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}`,
  eventChallengePhoto: (eventId: string, challengeId: string, challengeNumber: number) =>
    `/event/${eventId}/challenge-photo?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}`,
  eventChallengePhotoCamera: (eventId: string, challengeId: string, challengeNumber: number) =>
    `/event/${eventId}/challenge-photo-camera?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}`,
  eventChallengePhotoCompleted: (
    eventId: string,
    challengeId: string,
    challengeNumber: number,
    points: number,
  ) =>
    `/event/${eventId}/challenge-photo-completed?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}&points=${encodeURIComponent(String(points))}`,
} as const;

export const routeNames = {
  onboarding: 'Onboarding',
  login: 'Login',
  verifyCode: 'VerifyCode',
  home: 'Home',
  eventDetail: 'EventDetail',
  profile: 'Profile',
} as const;
