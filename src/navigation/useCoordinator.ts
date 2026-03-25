import { useRouter, type Href } from 'expo-router';

import { routePaths } from './routes';

export const useCoordinator = () => {
  const router = useRouter();

  return {
    goToOnboarding: () => router.replace(routePaths.onboarding as Href),
    goToLogin: () => router.push(routePaths.login as Href),
    goToVerifyCode: () =>
      router.push(
        `${routePaths.verifyCode}?sentAt=${Date.now()}` as Href,
      ),
    goToHome: () => router.replace(routePaths.home as Href),
    goToProfile: () => router.push(routePaths.profile as Href),
    goToEventDetail: (eventId: string) =>
      router.push(routePaths.eventDetail(eventId) as Href),
    goBack: () => router.back(),
  };
};
