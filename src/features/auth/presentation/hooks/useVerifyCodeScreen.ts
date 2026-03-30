import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { useVerifyCode } from './useVerifyCode';

/**
 * Orchestrates verify-code screen behavior: params, guards, delayed redirect.
 */
export function useVerifyCodeScreen() {
  const { email: emailParam, sentAt } = useLocalSearchParams<{ email?: string; sentAt?: string }>();
  const email = typeof emailParam === 'string' ? decodeURIComponent(emailParam) : '';
  const codeSentAt = sentAt ? parseInt(sentAt, 10) : undefined;
  const { goToHome } = useCoordinator();
  const homeNavigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSuccess = useCallback(() => {
    homeNavigateTimeoutRef.current = setTimeout(() => {
      homeNavigateTimeoutRef.current = null;
      goToHome();
    }, 1000);
  }, [goToHome]);

  useEffect(
    () => () => {
      if (homeNavigateTimeoutRef.current != null) {
        clearTimeout(homeNavigateTimeoutRef.current);
        homeNavigateTimeoutRef.current = null;
      }
    },
    [],
  );

  const verifyState = useVerifyCode(onSuccess, email, codeSentAt);

  return {
    email,
    ...verifyState,
  };
}
