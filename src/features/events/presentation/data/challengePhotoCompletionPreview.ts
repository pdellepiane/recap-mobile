/**
 * Photo URI for the “Challenge completed” screen (avoids long paths in query params).
 * Consumed once when that screen mounts.
 */
let previewUri: string | null = null;

export function setChallengePhotoCompletionPreview(uri: string) {
  previewUri = uri;
}

/** Returns the stored URI and clears it. */
export function takeChallengePhotoCompletionPreview(): string | null {
  const u = previewUri;
  previewUri = null;
  return u;
}
