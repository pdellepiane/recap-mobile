import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { routePaths } from './routes';

/**
 * Central navigation helpers built from {@link routePaths}. The returned object is
 * memoized on `router` so methods keep stable references (safe for `useEffect` deps).
 */
export const useCoordinator = () => {
  const router = useRouter();

  return useMemo(
    () => ({
    goToOnboarding: () => router.replace(routePaths.onboarding as Href),
    goToLogin: () => router.push(routePaths.login as Href),
    goToVerifyCode: (email: string) =>
      router.push(
        `${routePaths.verifyCode}?email=${encodeURIComponent(email)}&sentAt=${Date.now()}` as Href,
      ),
    goToHome: () => router.replace(routePaths.home as Href),
    /** Opens the profile tab under the Home stack (avoids stacking `/profile` separately). */
    goToProfile: () => router.navigate(routePaths.profile as Href),
    /** Presents an in-app browser as a root modal for a trusted HTTPS URL. */
    goToHomeWeb: (url: string) => router.push(routePaths.homeWeb(url) as Href),
    goToEventDetail: (eventId: string, tab?: 'detalle' | 'challenges' | 'ranking' | 'album') =>
      router.push(routePaths.eventDetail(eventId, tab) as Href),
    goToEventDetailTab: (eventId: string, tab: 'detalle' | 'challenges' | 'ranking' | 'album') =>
      router.replace(routePaths.eventDetail(eventId, tab) as Href),
    /** Switches detail tab while keeping the completed challenge in the query string. */
    goToEventDetailTabWithCompletedChallenge: (
      eventId: string,
      tab: 'detalle' | 'challenges' | 'ranking' | 'album',
      completedChallengeId: string,
      points: number,
    ) =>
      router.replace(
        routePaths.eventDetailTabWithCompletedChallenge(
          eventId,
          tab,
          completedChallengeId,
          points,
        ) as Href,
      ),
    /** Returns to the Challenges tab showing the challenge just completed. */
    goToEventChallengesCompleted: (eventId: string, completedChallengeId: string, points: number) =>
      router.replace(
        routePaths.eventDetailChallengesCompleted(eventId, completedChallengeId, points) as Href,
      ),
    /** Opens the embedded Google Maps screen for the event venue. */
    goToEventMap: (eventId: string, mapsQuery: string) => {
      const qs = new URLSearchParams({ q: mapsQuery }).toString();
      router.push(`${routePaths.eventMap(eventId)}?${qs}` as Href);
    },
    /** WhatsApp-style stories (mock photos for `evt-live-2`). */
    goToEventStories: (eventId: string) => router.push(routePaths.eventStories(eventId) as Href),
    /** Opens a trivia-style challenge (question + options). */
    goToEventChallengeQuiz: (eventId: string, challengeId: string, challengeNumber: number) =>
      router.push(routePaths.eventChallengeQuiz(eventId, challengeId, challengeNumber) as Href),
    /** Photo challenge: intro screen with instructions and button to open the camera. */
    goToEventChallengePhoto: (eventId: string, challengeId: string, challengeNumber: number) =>
      router.push(routePaths.eventChallengePhoto(eventId, challengeId, challengeNumber) as Href),
    /** Full-screen camera for the photo challenge (preview + shutter). */
    goToEventChallengePhotoCamera: (
      eventId: string,
      challengeId: string,
      challengeNumber: number,
    ) =>
      router.push(
        routePaths.eventChallengePhotoCamera(eventId, challengeId, challengeNumber) as Href,
      ),
    /** “Challenge completed” screen after publishing the photo (confetti + summary). */
    goToEventChallengePhotoCompleted: (
      eventId: string,
      challengeId: string,
      challengeNumber: number,
      points: number,
    ) =>
      router.replace(
        routePaths.eventChallengePhotoCompleted(
          eventId,
          challengeId,
          challengeNumber,
          points,
        ) as Href,
      ),
    goBack: () => router.back(),
    }),
    [router],
  );
};
