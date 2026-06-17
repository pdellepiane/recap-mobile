import { routePaths } from './routes';
import { resolvePushActionToAppPath } from './resolvePushActionToAppPath';
import analytics from '@/src/core/analytics';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';
import { useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';

/**
 * Central navigation helpers built from {@link routePaths}. The returned object is
 * memoized on `router` so methods keep stable references (safe for `useEffect` deps).
 */
export const useCoordinator = () => {
  const router = useRouter();

  const trackNav = (action: string, what: string, props?: Record<string, unknown>) => {
    void analytics.trackAction(action, {
      what,
      why: 'navigation',
      ...props,
    });
  };

  return useMemo(
    () => ({
      goToOnboarding: () => {
        trackNav('replace', routePaths.onboarding);
        router.replace(routePaths.onboarding as Href);
      },
      goToLogin: () => {
        trackNav('push', routePaths.login);
        router.push(routePaths.login as Href);
      },
      goToVerifyCode: (email: string) => {
        trackNav('push', routePaths.verifyCode, { email });
        router.push(
          `${routePaths.verifyCode}?email=${encodeURIComponent(email)}&sentAt=${Date.now()}` as Href,
        );
      },
      goToHome: () => {
        trackNav('replace', routePaths.home);
        router.replace(routePaths.home as Href);
      },
      /** Opens the profile tab under the Home stack (avoids stacking `/profile` separately). */
      goToProfile: () => {
        trackNav('navigate', routePaths.profile);
        router.navigate(routePaths.profile as Href);
      },
      goToProfileEdit: () => {
        trackNav('push', routePaths.profileEdit);
        router.push(routePaths.profileEdit as Href);
      },
      /** Presents an in-app browser as a root modal for a trusted HTTPS URL. */
      goToHomeWeb: (url: string) => {
        trackNav('push', routePaths.homeWeb(url), { url });
        router.push(routePaths.homeWeb(url) as Href);
      },
      goToEventDetail: (eventId: string, tab?: EventDetailTab) => {
        trackNav('push', routePaths.eventDetail(eventId, tab), { eventId, tab });
        router.push(routePaths.eventDetail(eventId, tab) as Href);
      },
      goToEventDetailCamera: (eventId: string, title?: string) => {
        trackNav('push', routePaths.eventDetailCamera(eventId, title), { eventId, title });
        router.push(routePaths.eventDetailCamera(eventId, title) as Href);
      },
      /** Switches detail tab while keeping the completed challenge in the query string. */
      goToEventDetailTabWithCompletedChallenge: (
        eventId: string,
        tab: EventDetailTab,
        completedChallengeId: string,
        points: number,
      ) => {
        trackNav(
          'replace',
          routePaths.eventDetailTabWithCompletedChallenge(
            eventId,
            tab,
            completedChallengeId,
            points,
          ),
          {
            eventId,
            tab,
            completedChallengeId,
            points,
          },
        );
        router.replace(
          routePaths.eventDetailTabWithCompletedChallenge(
            eventId,
            tab,
            completedChallengeId,
            points,
          ) as Href,
        );
      },
      /** Opens the embedded Google Maps screen for the event venue. */
      goToEventMap: (eventId: string, location: string) => {
        const qs = new URLSearchParams({ q: location }).toString();
        trackNav('push', `${routePaths.eventMap(eventId)}?${qs}`, { eventId, location });
        router.push(`${routePaths.eventMap(eventId)}?${qs}` as Href);
      },
      /** Host guest list + public-list toggle (modal presentation). */
      goToEventDetailParticipants: (eventId: string) => {
        trackNav('push', routePaths.eventDetailParticipants(eventId), { eventId });
        router.push(routePaths.eventDetailParticipants(eventId) as Href);
      },
      /** WhatsApp-style stories viewer (when story data is available). */
      goToEventStories: (eventId: string) => {
        trackNav('push', routePaths.eventStories(eventId), { eventId });
        router.push(routePaths.eventStories(eventId) as Href);
      },
      /** Opens a trivia-style challenge (question + options). */
      goToEventChallengeQuiz: (eventId: string, challengeId: string, challengeNumber: number) => {
        trackNav('push', routePaths.eventChallengeQuiz(eventId, challengeId, challengeNumber), {
          eventId,
          challengeId,
          challengeNumber,
        });
        router.push(routePaths.eventChallengeQuiz(eventId, challengeId, challengeNumber) as Href);
      },

      /** Host flow to create a new quiz challenge (question + answers). */
      goToEventChallengeQuizCreate: (eventId: string) => {
        trackNav('push', routePaths.eventChallengeQuizCreate(eventId), { eventId });
        router.push(routePaths.eventChallengeQuizCreate(eventId) as Href);
      },
      goToEventChallengeQuizCreateQuestion: (eventId: string, questionId: string) => {
        trackNav('push', routePaths.eventChallengeQuizCreateQuestion(eventId, questionId), {
          eventId,
          questionId,
        });
        router.push(routePaths.eventChallengeQuizCreateQuestion(eventId, questionId) as Href);
      },
      /** Host edits an existing quiz challenge (creator only; opens question options screen). */
      goToEventChallengeQuizEdit: (eventId: string, remoteChallengeId: string) => {
        const questionId = `edit-${remoteChallengeId}`;
        trackNav(
          'push',
          routePaths.eventChallengeQuizCreateQuestion(eventId, questionId, remoteChallengeId),
          { eventId, questionId, remoteChallengeId },
        );
        router.push(
          routePaths.eventChallengeQuizCreateQuestion(
            eventId,
            questionId,
            remoteChallengeId,
          ) as Href,
        );
      },
      /** Host flow to create new photo challenges (prompts + suggestions). */
      goToEventChallengePhotoCreate: (eventId: string) => {
        trackNav('push', routePaths.eventChallengePhotoCreate(eventId), { eventId });
        router.push(routePaths.eventChallengePhotoCreate(eventId) as Href);
      },
      /** Host edits an existing photo challenge (opens preview screen). */
      goToEventChallengePhotoEdit: (
        eventId: string,
        remoteChallengeId: string,
        challengeNumber: number,
      ) => {
        const challengeId = `edit-${remoteChallengeId}`;
        trackNav(
          'push',
          routePaths.eventChallengePhotoEditChallenge(eventId, challengeId, remoteChallengeId),
          { eventId, challengeId, remoteChallengeId, challengeNumber },
        );
        router.push(
          routePaths.eventChallengePhotoEditChallenge(
            eventId,
            challengeId,
            remoteChallengeId,
            challengeNumber,
          ) as Href,
        );
      },
      /** Photo challenge: intro screen with instructions and button to open the camera. */
      goToEventChallengePhoto: (eventId: string, challengeId: string, challengeNumber: number) => {
        trackNav('push', routePaths.eventChallengePhoto(eventId, challengeId, challengeNumber), {
          eventId,
          challengeId,
          challengeNumber,
        });
        router.push(routePaths.eventChallengePhoto(eventId, challengeId, challengeNumber) as Href);
      },
      /** Full-screen camera for the photo challenge (preview + shutter). */
      goToEventChallengePhotoCamera: (
        eventId: string,
        challengeId: string,
        challengeNumber: number,
      ) => {
        trackNav(
          'push',
          routePaths.eventChallengePhotoCamera(eventId, challengeId, challengeNumber),
          {
            eventId,
            challengeId,
            challengeNumber,
          },
        );
        router.push(
          routePaths.eventChallengePhotoCamera(eventId, challengeId, challengeNumber) as Href,
        );
      },
      /** “Challenge completed” screen after publishing the photo (confetti + summary). */
      goToEventChallengePhotoCompleted: (
        eventId: string,
        challengeId: string,
        challengeNumber: number,
        points: number,
      ) => {
        trackNav(
          'replace',
          routePaths.eventChallengePhotoCompleted(eventId, challengeId, challengeNumber, points),
          {
            eventId,
            challengeId,
            challengeNumber,
            points,
          },
        );
        router.replace(
          routePaths.eventChallengePhotoCompleted(
            eventId,
            challengeId,
            challengeNumber,
            points,
          ) as Href,
        );
      },
      /** “Challenge completed” screen after finishing a quiz challenge. */
      goToEventChallengeQuizCompleted: (
        eventId: string,
        challengeId: string,
        challengeNumber: number,
        points: number,
      ) => {
        trackNav(
          'replace',
          routePaths.eventChallengeQuizCompleted(eventId, challengeId, challengeNumber, points),
          {
            eventId,
            challengeId,
            challengeNumber,
            points,
          },
        );
        router.replace(
          routePaths.eventChallengeQuizCompleted(
            eventId,
            challengeId,
            challengeNumber,
            points,
          ) as Href,
        );
      },
      goBack: () => {
        trackNav('back', 'back');
        router.back();
      },
      /** Back when possible; otherwise home (e.g. cold-start deep link to a missing screen). */
      goBackOrHome: () => {
        if (router.canGoBack()) {
          trackNav('back', 'back');
          router.back();
          return;
        }
        trackNav('replace', routePaths.home);
        router.replace(routePaths.home as Href);
      },
      /** Deep link from a push notification `data.action` payload. */
      goToPushRedirect: (action: string) => {
        const resolved = resolvePushActionToAppPath(action);
        if (!resolved) {
          trackNav('push', routePaths.notFound, { source: 'push_notification', action });
          router.push(routePaths.notFound as Href);
          return;
        }
        trackNav('push', resolved, { source: 'push_notification' });
        router.push(resolved as Href);
      },
      goToNotFound: () => {
        trackNav('push', routePaths.notFound, { source: 'not_found' });
        router.push(routePaths.notFound as Href);
      },
    }),

    [router],
  );
};
