import { isApiRequestError, type ApiRequestError } from '@/src/core/http/ApiRequestError';
import type { TFunction } from 'i18next';
import { Alert } from 'react-native';

export type ChallengeAnswerErrorKey =
  | 'challenges.answerGuestsOnly'
  | 'challenges.answerSubmitError'
  | 'challenges.answerServerError';

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

function isGuestsOnlyChallengeAnswerError(error: ApiRequestError): boolean {
  if (error.statusCode === 403) {
    return true;
  }
  const blob = collectBodyText(error.body);
  return (
    blob.includes('only guests can answer') ||
    blob.includes('solo los invitados') ||
    blob.includes('solo invitados pueden')
  );
}

export function challengeAnswerErrorKeyFromApiError(error: ApiRequestError): ChallengeAnswerErrorKey {
  if (isGuestsOnlyChallengeAnswerError(error)) {
    return 'challenges.answerGuestsOnly';
  }
  if (error.statusCode >= 500) {
    return 'challenges.answerServerError';
  }
  return 'challenges.answerSubmitError';
}

export function challengeAnswerErrorKeyFromUnknown(error: unknown): ChallengeAnswerErrorKey {
  if (isApiRequestError(error)) {
    return challengeAnswerErrorKeyFromApiError(error);
  }
  return 'challenges.answerSubmitError';
}

/** Title + message alert for challenge answer submission failures. */
export function showChallengeAnswerErrorAlert(error: unknown, t: TFunction): void {
  const key = challengeAnswerErrorKeyFromUnknown(error);
  Alert.alert(t(`${key}Title`), t(`${key}Message`), [{ text: t('common.ok') }]);
}
