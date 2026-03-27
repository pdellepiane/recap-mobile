import { isApiRequestError } from '@/src/core/http/ApiRequestError';
import {
  clearVerifyCodeRateState,
  loadVerifyCodeRateState,
  recordFailedVerifyAttempt,
} from '@/src/features/auth/data/verifyCodeRateLimitStorage';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 5;

export const useVerifyCode = (onSuccess: () => void, email: string, codeSentAt?: number) => {
  const { loginWithCode, requestLoginCode } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendReady, setResendReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const lastAttemptedCode = useRef<string | null>(null);

  useEffect(() => {
    if (!email) {
      setResendReady(false);
      return;
    }
    setResendReady(false);
    let cancelled = false;
    void (async () => {
      const rate = await loadVerifyCodeRateState(email);
      if (cancelled) {
        return;
      }
      const now = Date.now();
      const fromSentAt =
        codeSentAt === undefined
          ? RESEND_COOLDOWN_SECONDS
          : Math.max(0, RESEND_COOLDOWN_SECONDS - Math.floor((now - codeSentAt) / 1000));
      const fromLock =
        rate.resendLockedUntil != null && rate.resendLockedUntil > now
          ? Math.ceil((rate.resendLockedUntil - now) / 1000)
          : 0;
      setResendCooldown(Math.max(fromSentAt, fromLock));
      setResendReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [email, codeSentAt]);

  const updateDigit = useCallback(
    (index: number, value: string) => {
      if (hasError || isCodeValid) {
        setHasError(false);
        setIsCodeValid(false);
        setErrorMessage('');
      }
      lastAttemptedCode.current = null;
      const num = value.replace(/\D/g, '');
      if (num.length > 1) {
        const chars = num.slice(0, CODE_LENGTH).split('');
        setDigits((prev) => {
          const next = [...prev];
          chars.forEach((char, i) => {
            if (index + i < CODE_LENGTH) {
              next[index + i] = char;
            }
          });
          return next;
        });
        const nextFocus = Math.min(index + chars.length, CODE_LENGTH - 1);
        focusInput(nextFocus);
      } else {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = num;
          return next;
        });
        if (num && index < CODE_LENGTH - 1) {
          focusInput(index + 1);
        }
      }
    },
    [focusInput, hasError, isCodeValid],
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace' && !digits[index] && index > 0) {
        lastAttemptedCode.current = null;
        focusInput(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    },
    [digits, focusInput],
  );

  const code = digits.join('');

  const verify = useCallback(async () => {
    if (!email || code.length !== CODE_LENGTH) {
      return;
    }
    if (lastAttemptedCode.current === code) {
      return;
    }

    lastAttemptedCode.current = code;
    setIsLoading(true);
    setHasError(false);
    setIsCodeValid(false);
    setErrorMessage('');

    try {
      await loginWithCode(email, code);
      await clearVerifyCodeRateState(email);
      setIsCodeValid(true);
      onSuccess();
    } catch (e) {
      const rate = await recordFailedVerifyAttempt(email);
      if (rate.resendLockedUntil != null) {
        const secs = Math.ceil((rate.resendLockedUntil - Date.now()) / 1000);
        setResendCooldown((prev) => Math.max(prev, Math.max(0, secs)));
      }
      setHasError(true);
      setIsCodeValid(false);
      setErrorMessage(isApiRequestError(e) ? e.message : 'Código incorrecto. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [code, email, loginWithCode, onSuccess]);

  useEffect(() => {
    if (!email || code.length !== CODE_LENGTH || isLoading) {
      return;
    }
    void verify();
  }, [code, email, isLoading, verify]);

  const handleResend = useCallback(async () => {
    if (!resendReady || resendCooldown > 0 || !email) {
      return;
    }
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    setHasError(false);
    setIsCodeValid(false);
    setErrorMessage('');
    setDigits(Array(CODE_LENGTH).fill(''));
    lastAttemptedCode.current = null;
    focusInput(0);
    try {
      await requestLoginCode(email);
      await clearVerifyCodeRateState(email);
    } catch {
      // Keep verify error UI clean after resend attempts.
    }
  }, [email, focusInput, requestLoginCode, resendCooldown, resendReady]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return {
    digits,
    code,
    resendCooldown,
    resendDisabled: !resendReady || resendCooldown > 0,
    hasError,
    isCodeValid,
    errorMessage,
    isLoading,
    inputRefs,
    updateDigit,
    handleKeyPress,
    handleResend,
    focusInput,
  };
};
