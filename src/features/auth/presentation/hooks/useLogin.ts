import { useState, useCallback } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valid email for testing: test@example.com */
export const VALID_EMAIL = 'test@example.com';

/** Invalid email for testing: invalid@example.com */
export const INVALID_EMAIL = 'invalid@example.com';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (hasError) {
      setHasError(false);
      setErrorMessage('');
    }
  }, [hasError]);

  const handleContinue = useCallback(async (onSuccess: () => void) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setHasError(true);
      setErrorMessage('correo incorrecto');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setHasError(true);
      setErrorMessage('correo incorrecto');
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (trimmedEmail.toLowerCase() === VALID_EMAIL) {
        onSuccess();
      } else {
        setHasError(true);
        setErrorMessage('correo incorrecto');
      }
    } catch {
      setHasError(true);
      setErrorMessage('correo incorrecto');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  return {
    email,
    hasError,
    errorMessage,
    isLoading,
    handleEmailChange,
    handleContinue,
  };
};
