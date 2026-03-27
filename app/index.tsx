import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { routePaths } from '@/src/navigation/routes';
import { Redirect, type Href } from 'expo-router';

export default function IndexRoute() {
  const { isReady, session } = useAuth();

  if (!isReady) {
    return null;
  }

  if (session) {
    return <Redirect href={routePaths.home as Href} />;
  }

  return <Redirect href={routePaths.onboarding as Href} />;
}
