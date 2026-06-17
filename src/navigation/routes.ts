import { EventDetailTab } from '../features/event-detail/presentation/hooks/eventDetailTabs';

export const routePaths = {
  onboarding: '/onboarding',
  login: '/login',
  verifyCode: '/verify-code',
  home: '/home',
  notFound: '/not-found',
  profile: '/home/profile',
  profileEdit: '/home/profile/edit',
  /** In-app WebView modal; `url` must be a full `https` URL (encoded). */
  homeWeb: (url: string) => `/in-app-web?url=${encodeURIComponent(url)}`,
  eventDetail: (eventId: string, tab?: EventDetailTab) =>
    tab ? `/event/${eventId}?tab=${encodeURIComponent(tab)}` : `/event/${eventId}`,
  eventDetailCamera: (eventId: string, title?: string) =>
    title?.trim()
      ? `/event/${eventId}/camera?title=${encodeURIComponent(title)}`
      : `/event/${eventId}/camera`,
  eventDetailChallengesCompleted: (eventId: string, completedChallengeId: string, points: number) =>
    `/event/${eventId}?tab=challenges&completedChallengeId=${encodeURIComponent(completedChallengeId)}&points=${encodeURIComponent(String(points))}`,
  eventDetailTabWithCompletedChallenge: (
    eventId: string,
    tab: EventDetailTab,
    completedChallengeId: string,
    points: number,
  ) =>
    `/event/${eventId}?tab=${encodeURIComponent(tab)}&completedChallengeId=${encodeURIComponent(completedChallengeId)}&points=${encodeURIComponent(String(points))}`,
  eventMap: (eventId: string) => `/event/${eventId}/map`,
  eventDetailParticipants: (eventId: string) => `/event/${eventId}/participants`,
  eventStories: (eventId: string) => `/event/${eventId}/stories`,
  eventChallengeQuiz: (eventId: string, challengeId: string, challengeNumber: number) =>
    `/event/${eventId}/challenge-quiz?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}`,
  eventChallengeQuizCompleted: (
    eventId: string,
    challengeId: string,
    challengeNumber: number,
    points: number,
  ) =>
    `/event/${eventId}/challenge-quiz-completed?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}&points=${encodeURIComponent(String(points))}`,
  eventChallengeQuizCreate: (eventId: string) => `/event/${eventId}/challenge-quiz-create`,
  eventChallengeQuizCreateQuestion: (
    eventId: string,
    questionId: string,
    remoteChallengeId?: string,
  ) => {
    const base = `/event/${eventId}/challenge-quiz-create/question?questionId=${encodeURIComponent(questionId)}`;
    return remoteChallengeId
      ? `${base}&challengeId=${encodeURIComponent(remoteChallengeId)}`
      : base;
  },
  eventChallengePhotoCreate: (eventId: string) => `/event/${eventId}/challenge-photo-create`,
  eventChallengePhotoEditChallenge: (
    eventId: string,
    challengeId: string,
    remoteChallengeId?: string,
    challengeNumber?: number,
  ) => {
    const base = `/event/${eventId}/challenge-photo-create/challenge?challengeId=${encodeURIComponent(challengeId)}&challengeNumber=${encodeURIComponent(String(challengeNumber))}`;
    return remoteChallengeId
      ? `${base}&remoteChallengeId=${encodeURIComponent(remoteChallengeId)}`
      : base;
  },
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
