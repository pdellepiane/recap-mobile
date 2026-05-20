import analytics from './index';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useGlobalSearchParams, usePathname, useSegments } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';

function normalizeRouteParams(params: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'string') {
      out[k] = v;
      continue;
    }
    if (Array.isArray(v)) {
      out[k] = v.join(',');
      continue;
    }
    if (v != null) {
      out[k] = String(v);
    }
  }
  return out;
}

export function AnalyticsRouteObserver() {
  const { session } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();
  const searchParams = useGlobalSearchParams<Record<string, string | string[]>>();
  const lastRouteKeyRef = useRef<string>('');

  const routeParams = useMemo(
    () => normalizeRouteParams(searchParams as Record<string, unknown>),
    [searchParams],
  );

  useEffect(() => {
    void analytics.init(session?.user.id);
  }, [session?.user.id]);

  useEffect(() => {
    analytics.setActor({
      userId: session?.user.id,
      userRole: session?.user.role,
      authenticated: Boolean(session?.user.id),
    });
  }, [session?.user.id, session?.user.role]);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }
    void analytics.identifyUser(session.user.id, session.user);
  }, [session?.user]);

  useEffect(() => {
    const routeKey = `${pathname}|${segments.join('/')}`;
    if (!pathname || lastRouteKeyRef.current === routeKey) {
      return;
    }
    lastRouteKeyRef.current = routeKey;
    void analytics.trackRouteEnter({
      what: pathname,
      why: 'navigation_enter',
      whoUserId: session?.user.id,
      whoRole: session?.user.role,
      whoAuthenticated: Boolean(session?.user.id),
      routePath: pathname,
      routeSegments: segments,
      routeParams,
    });
  }, [pathname, routeParams, segments, session?.user.id, session?.user.role]);

  return null;
}
