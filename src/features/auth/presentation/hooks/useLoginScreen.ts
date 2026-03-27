import { useKeyboardVisible } from './useKeyboardVisible';
import { useLogin } from './useLogin';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback } from 'react';

/**
 * Orchestrates login screen behavior: form state, keyboard spacing and verify-code navigation.
 */
export function useLoginScreen() {
  const keyboardVisible = useKeyboardVisible();
  const { goToVerifyCode } = useCoordinator();
  const { email, hasError, errorMessage, isLoading, handleEmailChange, handleContinue } =
    useLogin();

  const handlePressContinue = useCallback(() => {
    void handleContinue((sentEmail) => goToVerifyCode(sentEmail));
  }, [goToVerifyCode, handleContinue]);

  return {
    keyboardVisible,
    email,
    hasError,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePressContinue,
  };
}
