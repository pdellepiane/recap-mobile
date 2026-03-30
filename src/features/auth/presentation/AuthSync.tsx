import { useAuth } from './context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useSegments } from 'expo-router';
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
  const { goToHome, goToOnboarding } = useCoordinator();

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
        goToHome();
        return;
      }
      const onAuthRoute = root === 'login' || root === 'verify-code';
      if (onAuthRoute) {
        goToHome();
      }
      return;
    }

    const onLoggedOutAllowedRoute =
      root === 'onboarding' || root === 'login' || root === 'verify-code';
    if (!onLoggedOutAllowedRoute) {
      goToOnboarding();
    }
  }, [isReady, session, segments, goToHome, goToOnboarding]);

  return null;
}
