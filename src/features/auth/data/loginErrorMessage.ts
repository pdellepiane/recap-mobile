import { isApiRequestError, type ApiRequestError } from '@/src/core/http/ApiRequestError';
import i18n from '@/src/i18n/i18n';

export type LoginErrorKey =
  | 'auth.invalidEmail'
  | 'auth.tooManyRequests'
  | 'auth.serverOrNetwork'
  | 'auth.unknown';

export function loginMessageForKey(key: LoginErrorKey): string {
  return i18n.t(key);
}

function collectBodyText(body: unknown): string {
  if (!body || typeof body !== 'object') {
    return '';
  }
  const o = body as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof o.error === 'string') {
    parts.push(o.error);
  }
  if (typeof o.message === 'string') {
    parts.push(o.message);
  }
  return parts.join(' ').toLowerCase();
}

function isRateLimited(statusCode: number, blob: string): boolean {
  if (statusCode === 429) {
    return true;
  }
  return (
    blob.includes('too many') ||
    blob.includes('rate limit') ||
    blob.includes('throttl') ||
    blob.includes('demasiados')
  );
}

export function loginErrorKeyFromApiError(error: ApiRequestError): LoginErrorKey {
  const { statusCode, body } = error;
  const blob = collectBodyText(body);

  if (isRateLimited(statusCode, blob)) {
    return 'auth.tooManyRequests';
  }
  if (statusCode >= 500) {
    return 'auth.serverOrNetwork';
  }
  if (statusCode === 422 || statusCode === 400) {
    return 'auth.invalidEmail';
  }

  return 'auth.unknown';
}

function isLikelyNetworkFailure(e: unknown): boolean {
  if (!(e instanceof Error)) {
    return false;
  }
  const m = e.message.toLowerCase();
  return (
    m.includes('network') ||
    m.includes('fetch') ||
    m.includes('failed to connect') ||
    m.includes('internet') ||
    m.includes('timeout')
  );
}

/** User-facing message for login / request-code failures. Never surfaces raw backend strings. */
export function messageForLoginFailure(e: unknown): string {
  if (isApiRequestError(e)) {
    return loginMessageForKey(loginErrorKeyFromApiError(e));
  }
  if (isLikelyNetworkFailure(e)) {
    return loginMessageForKey('auth.serverOrNetwork');
  }
  return loginMessageForKey('auth.unknown');
}
