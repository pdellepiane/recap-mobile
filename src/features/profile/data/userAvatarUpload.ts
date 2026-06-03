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
  return 'avatar.jpg';
}

/** Builds multipart/form-data for POST /api/user/avatar. */
export function buildUserAvatarFormData(fileUri: string): FormData {
  const formData = new FormData();
  const file: ReactNativeFormDataFile = {
    uri: fileUri,
    type: inferMimeType(fileUri),
    name: inferFileName(fileUri),
  };
  formData.append('avatar', file as unknown as Blob);
  return formData;
}
