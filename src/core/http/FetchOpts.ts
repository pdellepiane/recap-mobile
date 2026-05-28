import type { HttpAuthMode } from './HttpClient';

/** Optional per-request HTTP options (auth, cancellation). */
export type FetchOpts = {
  auth?: HttpAuthMode;
  signal?: AbortSignal;
};
