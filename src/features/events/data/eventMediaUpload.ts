import type { EventMediaUploadParams } from '@/src/core/api/types/eventMedia';

type ReactNativeFormDataFile = {
  uri: string;
  type: string;
  name: string;
};

function inferMimeType(fileUri: string): string {
  const lower = fileUri.split('?')[0]?.toLowerCase() ?? '';
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lower.endsWith('.heic')) {
    return 'image/heic';
  }
  return 'image/jpeg';
}

function inferFileName(fileUri: string): string {
  const segment = fileUri.split('?')[0]?.split('/').pop();
  if (segment && segment.includes('.')) {
    return segment;
  }
  return 'photo.jpg';
}

/** Builds multipart/form-data for POST /api/events/:id/media. */
export function buildEventMediaFormData(params: EventMediaUploadParams): FormData {
  const formData = new FormData();
  const file: ReactNativeFormDataFile = {
    uri: params.fileUri,
    type: params.mimeType ?? inferMimeType(params.fileUri),
    name: params.fileName ?? inferFileName(params.fileUri),
  };

  formData.append('file', file as unknown as Blob);

  const answerPhotoId = params.event_challenge_answer_photo_id;
  if (answerPhotoId != null && answerPhotoId > 0) {
    formData.append('event_challenge_answer_photo_id', String(answerPhotoId));
  }

  return formData;
}
