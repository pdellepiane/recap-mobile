import { useAuth } from './context/AuthContext';
import { routePaths } from '@/src/navigation/routes';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useEffect } from 'react';

/**
 * Keeps auth-related routes in sync with the active session.
 * Redirect rules handled here:
 * - signed-in users on `login` or `verify-code` are sent to `home`
 * - signed-in users on `onboarding` are sent to `home`
 * - signed-out users on app routes (`home`, `event`, …) are sent to `onboarding` (e.g. after logout)
 */
export function AuthSync() {
  const { isReady, session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const root = segments[0];
    if (root === undefined) {
      return;
    }

    if (session) {
      if (root === 'onboarding') {
        router.replace(routePaths.home as Href);
        return;
      }
      const onAuthRoute = root === 'login' || root === 'verify-code';
      if (onAuthRoute) {
        router.replace(routePaths.home as Href);
      }
      return;
    }

    const onLoggedOutAllowedRoute =
      root === 'onboarding' || root === 'login' || root === 'verify-code';
    if (!onLoggedOutAllowedRoute) {
      router.replace(routePaths.onboarding as Href);
    }
  }, [isReady, session, segments, router]);

  return null;
}
