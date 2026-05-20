const DEFAULT_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!DEFAULT_BASE) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not set');
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

/** Turns API `path` (relative or absolute) into a full URL for `<Image source={{ uri }} />`. */
export function resolveApiAssetUrl(path: string): string {
  const p = path.trim();
  if (!p) {
    return '';
  }
  if (/^https?:\/\//i.test(p)) {
    return p;
  }
  const base = trimTrailingSlash(DEFAULT_BASE ?? '');
  const suffix = p.startsWith('/') ? p : `/${p}`;
  return `${base}${suffix}`;
}
