import { resolveApiAssetUrl } from '@/src/core/api/resolveApiAssetUrl';

/** Up to six full image URLs from `guest_images` (relative paths resolved), padded with `cover`. */
export function parseGuestImageUris(
  guestImages: readonly string[],
  coverFallback: string,
): string[] {
  const out: string[] = [];
  for (const item of guestImages) {
    if (out.length >= 6) {
      break;
    }
    const s = item.trim();
    if (s) {
      out.push(resolveApiAssetUrl(s));
    }
  }
  const fallback = resolveApiAssetUrl(coverFallback.trim());
  while (out.length < 6) {
    out.push(fallback || '');
  }
  return out.slice(0, 6);
}
