import { isApiRequestError, type ApiRequestError } from '@/src/core/http/ApiRequestError';
import type { TFunction } from 'i18next';
import { Alert } from 'react-native';

export type EventMediaUploadErrorKey =
  | 'eventDetail.mediaUploadTooLarge'
  | 'eventDetail.mediaUploadError'
  | 'eventDetail.mediaUploadServerError';

export function eventMediaUploadErrorKeyFromApiError(error: ApiRequestError): EventMediaUploadErrorKey {
  if (error.statusCode === 413) {
    return 'eventDetail.mediaUploadTooLarge';
  }
  if (error.statusCode >= 500) {
    return 'eventDetail.mediaUploadServerError';
  }
  return 'eventDetail.mediaUploadError';
}

export function eventMediaUploadErrorKeyFromUnknown(error: unknown): EventMediaUploadErrorKey {
  if (isApiRequestError(error)) {
    return eventMediaUploadErrorKeyFromApiError(error);
  }
  return 'eventDetail.mediaUploadError';
}

/** Title + message alert for album / challenge photo upload failures. */
export function showEventMediaUploadErrorAlert(error: unknown, t: TFunction): void {
  const key = eventMediaUploadErrorKeyFromUnknown(error);
  Alert.alert(t(`${key}Title`), t(`${key}Message`), [{ text: t('common.ok') }]);
}
