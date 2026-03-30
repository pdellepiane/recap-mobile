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
    /** Abre el tab de perfil bajo la stack de Home (evita apilar `/profile` aparte). */
    goToProfile: () => router.navigate(routePaths.profile as Href),
    goToEventDetail: (eventId: string, tab?: 'detalle' | 'challenges' | 'ranking' | 'album') =>
      router.push(routePaths.eventDetail(eventId, tab) as Href),
    goBack: () => router.back(),
    }),
    [router],
  );
};
