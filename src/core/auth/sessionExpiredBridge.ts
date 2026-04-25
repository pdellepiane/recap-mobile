import { authUserPaths } from '@/src/core/api/paths';
import { getAuthAccessToken, setAuthAccessToken } from '@/src/core/http/authSession';
import { clearPersistedSession, getPersistedAccessToken } from '@/src/features/auth/data/sessionStorage';

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

let clearReactSession: (() => void | Promise<void>) | null = null;
let inFlight: Promise<void> | null = null;

/** Called from {@link AuthProvider} so API 401 handling can clear React session (triggers {@link AuthSync} redirect). */
export function registerSessionExpiredHandler(fn: (() => void | Promise<void>) | null): void {
  clearReactSession = fn;
}

/**
 * Best-effort server logout + local wipe + React session clear. Deduplicated if many requests get 401 at once.
 * Uses `fetch` directly so this does not recurse through {@link FetchHttpClient}.
 */
export function runSessionExpiredFlow(apiBaseUrl: string): Promise<void> {
  if (inFlight) {
    return inFlight;
  }
  inFlight = (async () => {
    try {
      let token = getAuthAccessToken()?.trim() ?? '';
      if (!token) {
        token = (await getPersistedAccessToken())?.trim() ?? '';
      }
      if (token) {
        const base = trimTrailingSlash(apiBaseUrl);
        const path = authUserPaths.logout.startsWith('/')
          ? authUserPaths.logout
          : `/${authUserPaths.logout}`;
        const url = `${base}${path}`;
        await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }).catch(() => undefined);
      }
      setAuthAccessToken(null);
      await clearPersistedSession();
      await clearReactSession?.();
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}
