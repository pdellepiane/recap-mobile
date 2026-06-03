import { File } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

/** API max per `file` field (~20 MB); compress further so nginx proxies accept the body. */
export const EVENT_MEDIA_TARGET_MAX_BYTES = 4 * 1024 * 1024;
const MAX_EDGE_PX = 2048;
const MIN_JPEG_QUALITY = 0.45;
const START_JPEG_QUALITY = 0.82;

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error),
    );
  });
}

function resizeToMaxEdge(width: number, height: number): { width: number; height: number } | null {
  const longest = Math.max(width, height);
  if (longest <= MAX_EDGE_PX) {
    return null;
  }
  const scale = MAX_EDGE_PX / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function readFileSize(uri: string): number | null {
  const file = new File(uri);
  if (!file.exists) {
    return null;
  }
  return file.size;
}

/**
 * Resizes and recompresses a local image so POST /api/events/:id/media stays within limits.
 */
export async function prepareEventMediaUploadFile(fileUri: string): Promise<{
  uri: string;
  mimeType: string;
  fileName: string;
}> {
  const trimmed = fileUri.trim();
  if (!trimmed) {
    throw new Error('Missing file URI');
  }

  let dimensions: { width: number; height: number };
  try {
    dimensions = await getImageSize(trimmed);
  } catch {
    dimensions = { width: MAX_EDGE_PX, height: MAX_EDGE_PX };
  }

  const targetSize = resizeToMaxEdge(dimensions.width, dimensions.height);
  const resizeAction = targetSize
    ? [{ resize: { width: targetSize.width, height: targetSize.height } }]
    : [];

  let quality = START_JPEG_QUALITY;
  let currentUri = trimmed;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const result = await manipulateAsync(
      attempt === 0 ? trimmed : currentUri,
      attempt === 0 ? resizeAction : [],
      { compress: quality, format: SaveFormat.JPEG },
    );
    currentUri = result.uri;

    const bytes = readFileSize(currentUri);
    if (bytes == null || bytes <= EVENT_MEDIA_TARGET_MAX_BYTES) {
      return {
        uri: currentUri,
        mimeType: 'image/jpeg',
        fileName: 'photo.jpg',
      };
    }

    quality = Math.max(MIN_JPEG_QUALITY, quality - 0.1);
  }

  return {
    uri: currentUri,
    mimeType: 'image/jpeg',
    fileName: 'photo.jpg',
  };
}
