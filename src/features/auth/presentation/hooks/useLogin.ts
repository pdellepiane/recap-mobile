import {
  loginMessageForKey,
  messageForLoginFailure,
} from '@/src/features/auth/data/loginErrorMessage';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useState, useCallback } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLogin = () => {
  const { requestLoginCode } = useAuth();
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setHasError(false);
    setErrorMessage('');
  }, []);

  const handleContinue = useCallback(
    async (onRequestSent: (email: string) => void) => {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setHasError(true);
        setErrorMessage(loginMessageForKey('auth.invalidEmail'));
        return;
      }

      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setHasError(true);
        setErrorMessage(loginMessageForKey('auth.invalidEmail'));
        return;
      }

      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');

      try {
        await requestLoginCode(trimmedEmail);
        onRequestSent(trimmedEmail);
      } catch (e) {
        setHasError(true);
        setErrorMessage(messageForLoginFailure(e));
      } finally {
        setIsLoading(false);
      }
    },
    [email, requestLoginCode],
  );

  return {
    email,
    hasError,
    errorMessage,
    isLoading,
    handleEmailChange,
    handleContinue,
  };
};
