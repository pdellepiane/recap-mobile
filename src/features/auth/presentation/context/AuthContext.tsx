import { authRepository } from '@/src/core/di/container';
import { getAuthAccessToken, setAuthAccessToken } from '@/src/core/http/authSession';
import type { AuthSession } from '@/src/domain/entities';
import {
  clearPersistedSession,
  loadPersistedSession,
  persistSessionSnapshot,
} from '@/src/features/auth/data/sessionStorage';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type AuthContextValue = {
  isReady: boolean;
  session: AuthSession | null;
  requestLoginCode: (email: string) => Promise<void>;
  loginWithCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const persisted = await loadPersistedSession();
        if (cancelled) {
          return;
        }
        if (persisted) {
          setAuthAccessToken(persisted.token);
          setSession({ user: persisted.user });
        } else {
          setAuthAccessToken(null);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
          SplashScreen.hideAsync().catch(() => undefined);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const requestLoginCode = useCallback(async (email: string) => {
    await authRepository.requestLoginCode(email);
  }, []);

  const loginWithCode = useCallback(async (email: string, code: string) => {
    const user = await authRepository.loginWithCode(email, code);
    const access = getAuthAccessToken();
    if (!access) {
      throw new Error('Missing access token after login');
    }
    await persistSessionSnapshot(access, user);
    setSession({ user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authRepository.logout();
    } finally {
      setAuthAccessToken(null);
      await Promise.all([clearPersistedSession()]);
      setSession(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      session,
      requestLoginCode,
      loginWithCode,
      logout,
    }),
    [isReady, session, requestLoginCode, loginWithCode, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** App auth/session for invited members (accounts created on the web). */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
