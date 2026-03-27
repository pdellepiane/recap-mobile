import { useAuth } from './context/AuthContext';
import { routePaths } from '@/src/navigation/routes';
import { useRouter, useSegments, type Href } from 'expo-router';
import { useEffect } from 'react';

/**
 * Keeps auth-related routes in sync with the active session.
 * Redirect rules handled here:
 * - signed-in users on `login` or `verify-code` are sent to `home`
 * - signed-in users on `onboarding` are sent to `home`
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

    if (root === 'onboarding') {
      if (session) {
        router.replace(routePaths.home as Href);
      }
      return;
    }

    const onAuthRoute = root === 'login' || root === 'verify-code';

    if (session && onAuthRoute) {
      router.replace(routePaths.home as Href);
    }
  }, [isReady, session, segments, router]);

  return null;
}
