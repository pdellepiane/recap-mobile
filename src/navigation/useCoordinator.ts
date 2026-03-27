import { useRouter, type Href } from 'expo-router';
import { routePaths } from './routes';

export const useCoordinator = () => {
  const router = useRouter();

  return {
    goToOnboarding: () => router.replace(routePaths.onboarding as Href),
    goToLogin: () => router.push(routePaths.login as Href),
    goToLoginReplace: () => router.replace(routePaths.login as Href),
    goToVerifyCode: (email: string) =>
      router.push(
        `${routePaths.verifyCode}?email=${encodeURIComponent(email)}&sentAt=${Date.now()}` as Href,
      ),
    goToHome: () => router.replace(routePaths.home as Href),
    goToProfile: () => router.navigate(routePaths.profile as Href),
    goBack: () => router.back(),
  };
};
