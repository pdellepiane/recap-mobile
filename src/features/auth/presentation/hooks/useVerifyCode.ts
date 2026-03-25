import { useCallback, useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

/** Valid code for testing: 123456 */
export const VALID_CODE = "123456";

/** Invalid code example for testing: 000000 */
export const INVALID_CODE = "000000";

export const useVerifyCode = (onSuccess: () => void, codeSentAt?: number) => {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(() => {
    if (!codeSentAt) return RESEND_COOLDOWN_SECONDS;
    const elapsed = Math.floor((Date.now() - codeSentAt) / 1000);
    return Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed);
  });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const lastAttemptedCode = useRef<string | null>(null);

  const updateDigit = useCallback(
    (index: number, value: string) => {
      if (hasError) {
        setHasError(false);
        setErrorMessage("");
      }
      lastAttemptedCode.current = null;
      const num = value.replace(/\D/g, "");
      if (num.length > 1) {
        // Paste: take first 6 digits
        const chars = num.slice(0, CODE_LENGTH).split("");
        setDigits((prev) => {
          const next = [...prev];
          chars.forEach((char, i) => {
            if (index + i < CODE_LENGTH) next[index + i] = char;
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
    [focusInput, hasError],
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !digits[index] && index > 0) {
        lastAttemptedCode.current = null;
        focusInput(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    },
    [digits, focusInput],
  );

  const code = digits.join("");

  const verify = useCallback(
    async (onSuccess: () => void) => {
      if (code.length !== CODE_LENGTH) return;
      if (lastAttemptedCode.current === code) return;

      lastAttemptedCode.current = code;
      setIsLoading(true);
      setHasError(false);
      setErrorMessage("");

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (code === VALID_CODE) {
          onSuccess();
        } else {
          setHasError(true);
          setErrorMessage("Código incorrecto. Intenta nuevamente.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [code],
  );

  useEffect(() => {
    if (code.length === CODE_LENGTH && !isLoading) {
      verify(onSuccess);
    }
  }, [code, isLoading, verify, onSuccess]);

  const handleResend = useCallback(() => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }, [resendCooldown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return {
    digits,
    code,
    resendCooldown,
    hasError,
    errorMessage,
    isLoading,
    inputRefs,
    updateDigit,
    handleKeyPress,
    handleResend,
    focusInput,
  };
};
