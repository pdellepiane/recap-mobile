import { isApiRequestError, type ApiRequestError } from '@/src/core/http/ApiRequestError';
import i18n from '@/src/i18n/i18n';

/**
 * Stable keys for verify-code failures — map to `verify.*` in `en.json` / `es.json`.
 * Classification uses HTTP status + response body shape/keywords only, not raw backend prose.
 */
export type VerifyCodeErrorKey =
  | 'verify.invalidCode'
  | 'verify.expiredCode'
  | 'verify.codeAlreadyUsed'
  | 'verify.tooManyRequests'
  | 'verify.serverOrNetwork'
  | 'verify.unknown';

export function verifyCodeMessageForKey(key: VerifyCodeErrorKey): string {
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
  const errors = o.errors;
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    for (const val of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') {
            parts.push(item);
          }
        }
      } else if (typeof val === 'string') {
        parts.push(val);
      }
    }
  }
  return parts.join(' ').toLowerCase();
}

function keywordKey(blob: string): VerifyCodeErrorKey | null {
  if (!blob.trim()) {
    return null;
  }
  if (
    /\bexpir(e|ed|a|ó)\b/.test(blob) ||
    blob.includes('expired') ||
    blob.includes('caduc')
  ) {
    return 'verify.expiredCode';
  }
  if (
    /\b(already|ya)\b.*\b(us(ed|ado)?|invalid)\b/.test(blob) ||
    blob.includes('already been used') ||
    blob.includes('ya fue usado') ||
    blob.includes('already used')
  ) {
    return 'verify.codeAlreadyUsed';
  }
  if (
    blob.includes('too many') ||
    blob.includes('rate limit') ||
    blob.includes('throttl') ||
    blob.includes('demasiados')
  ) {
    return 'verify.tooManyRequests';
  }
  return null;
}

/** Derive a stable error key from a failed login-code API response. */
export function verifyCodeErrorKeyFromApiError(error: ApiRequestError): VerifyCodeErrorKey {
  const { statusCode, body } = error;
  if (statusCode === 429) {
    return 'verify.tooManyRequests';
  }
  if (statusCode >= 500) {
    return 'verify.serverOrNetwork';
  }

  const blob = collectBodyText(body);
  const fromKeywords = keywordKey(blob);
  if (fromKeywords) {
    return fromKeywords;
  }

  if (statusCode === 401 || statusCode === 403) {
    return 'verify.invalidCode';
  }
  if (statusCode === 422) {
    return 'verify.invalidCode';
  }
  if (statusCode === 400) {
    return 'verify.invalidCode';
  }

  return 'verify.unknown';
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

/**
 * User-facing message for verify-screen failures. Never surfaces raw backend strings.
 */
export function messageForVerifyCodeFailure(e: unknown): string {
  if (isApiRequestError(e)) {
    return verifyCodeMessageForKey(verifyCodeErrorKeyFromApiError(e));
  }
  if (isLikelyNetworkFailure(e)) {
    return verifyCodeMessageForKey('verify.serverOrNetwork');
  }
  return verifyCodeMessageForKey('verify.unknown');
}
