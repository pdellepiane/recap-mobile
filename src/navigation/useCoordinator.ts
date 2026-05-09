import { routePaths } from './routes';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';

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
      goToEventDetail: (eventId: string, tab?: EventDetailTab) =>
        router.push(routePaths.eventDetail(eventId, tab) as Href),
      goToEventDetailCamera: (eventId: string, title?: string) =>
        router.push(routePaths.eventDetailCamera(eventId, title) as Href),
      /** Switches detail tab while keeping the completed challenge in the query string. */
      goToEventDetailTabWithCompletedChallenge: (
        eventId: string,
        tab: EventDetailTab,
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
      /** Opens the embedded Google Maps screen for the event venue. */
      goToEventMap: (eventId: string, location: string) => {
        const qs = new URLSearchParams({ q: location }).toString();
        router.push(`${routePaths.eventMap(eventId)}?${qs}` as Href);
      },
      /** Host guest list + public-list toggle (modal presentation). */
      goToEventDetailParticipants: (eventId: string) =>
        router.push(routePaths.eventDetailParticipants(eventId) as Href),
      /** WhatsApp-style stories viewer (when story data is available). */
      goToEventStories: (eventId: string) => router.push(routePaths.eventStories(eventId) as Href),
      /** Opens a trivia-style challenge (question + options). */
      goToEventChallengeQuiz: (eventId: string, challengeId: string, challengeNumber: number) =>
        router.push(routePaths.eventChallengeQuiz(eventId, challengeId, challengeNumber) as Href),

      /** Host flow to create a new quiz challenge (question + answers). */
      goToEventChallengeQuizCreate: (eventId: string) =>
        router.push(routePaths.eventChallengeQuizCreate(eventId) as Href),
      goToEventChallengeQuizCreateQuestion: (eventId: string, questionId: string) =>
        router.push(routePaths.eventChallengeQuizCreateQuestion(eventId, questionId) as Href),
      /** Host flow to create new photo challenges (prompts + suggestions). */
      goToEventChallengePhotoCreate: (eventId: string) =>
        router.push(routePaths.eventChallengePhotoCreate(eventId) as Href),
      goToEventChallengePhotoCreateChallenge: (eventId: string, challengeId: string) =>
        router.push(routePaths.eventChallengePhotoCreateChallenge(eventId, challengeId) as Href),
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
      /** “Challenge completed” screen after finishing a quiz challenge. */
      goToEventChallengeQuizCompleted: (
        eventId: string,
        challengeId: string,
        challengeNumber: number,
        points: number,
      ) =>
        router.replace(
          routePaths.eventChallengeQuizCompleted(
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
