import { useCoordinator } from '@/src/navigation/useCoordinator';

export function useNotFoundScreen(): { onBackPress: () => void } {
  const { goBackOrHome } = useCoordinator();
  return { onBackPress: goBackOrHome };
}
