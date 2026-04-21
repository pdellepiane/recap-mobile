/** Up to six image URLs from `guest_images` (strings or `{ url: string }`), padded with `cover`. */
export function parseGuestImageUris(guestImages: unknown[], coverFallback: string): string[] {
  const out: string[] = [];
  for (const item of guestImages) {
    if (out.length >= 6) {
      break;
    }
    if (typeof item === 'string' && item.trim()) {
      out.push(item.trim());
      continue;
    }
    if (item && typeof item === 'object' && 'url' in item) {
      const u = (item as { url?: unknown }).url;
      if (typeof u === 'string' && u.trim()) {
        out.push(u.trim());
      }
    }
  }
  const fallback = coverFallback.trim();
  while (out.length < 6) {
    out.push(fallback || '');
  }
  return out.slice(0, 6);
}
