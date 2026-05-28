import analytics from '@/src/core/analytics';
import { registerSessionExpiredHandler } from '@/src/core/auth/sessionExpiredBridge';
import { authRepository } from '@/src/core/di/container';
import { getAuthAccessToken, setAuthAccessToken } from '@/src/core/http/authSession';
import type { AuthSession } from '@/src/domain/entities';
import {
  clearPersistedSession,
  loadPersistedSession,
  persistSessionSnapshot,
} from '@/src/features/auth/data/sessionStorage';
import { isAbortError } from '@/src/core/http/isAbortError';
import * as SplashScreen from 'expo-splash-screen';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type AuthContextValue = {
  isReady: boolean;
  session: AuthSession | null;
  requestLoginCode: (email: string) => Promise<void>;
  loginWithCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  /** GET /api/user/me — updates session + SecureStore when successful. */
  refreshUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const refreshGenerationRef = useRef(0);
  const refreshAbortRef = useRef<AbortController | null>(null);

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

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const access = getAuthAccessToken()?.trim();
    if (!access) {
      return false;
    }
    refreshAbortRef.current?.abort();
    const controller = new AbortController();
    refreshAbortRef.current = controller;
    const generation = ++refreshGenerationRef.current;
    try {
      const user = await authRepository.fetchCurrentUser({ signal: controller.signal });
      if (generation !== refreshGenerationRef.current) {
        return false;
      }
      await persistSessionSnapshot(access, user);
      if (generation !== refreshGenerationRef.current) {
        return false;
      }
      setSession({ user });
      return true;
    } catch (e) {
      if (isAbortError(e)) {
        return false;
      }
      return false;
    } finally {
      if (refreshAbortRef.current === controller) {
        refreshAbortRef.current = null;
      }
    }
  }, []);

  /** After cold start, reconcile profile with GET /api/user/me (keeps cached user if request fails). */
  useEffect(() => {
    if (!isReady || !getAuthAccessToken()?.trim()) {
      return;
    }
    void refreshUser();
  }, [isReady, refreshUser]);

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      refreshGenerationRef.current += 1;
      refreshAbortRef.current?.abort();
      refreshAbortRef.current = null;
      analytics.clearAll();
      setSession(null);
    });
    return () => {
      registerSessionExpiredHandler(null);
    };
  }, []);

  const requestLoginCode = useCallback(async (email: string) => {
    await authRepository.requestLoginCode(email);
  }, []);

  const loginWithCode = useCallback(
    async (email: string, code: string) => {
      const user = await authRepository.loginWithCode(email, code);
      const access = getAuthAccessToken();
      if (!access) {
        throw new Error('Missing access token after login');
      }
      await persistSessionSnapshot(access, user);
      setSession({ user });
      await refreshUser();
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    refreshGenerationRef.current += 1;
    refreshAbortRef.current?.abort();
    refreshAbortRef.current = null;
    try {
      await authRepository.logout();
    } finally {
      setAuthAccessToken(null);
      await Promise.all([clearPersistedSession()]);
      analytics.clearAll();
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
      refreshUser,
    }),
    [isReady, session, requestLoginCode, loginWithCode, logout, refreshUser],
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
