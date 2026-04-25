const DEFAULT_BASE = 'https://dev.api.recap.sinenvolturas.com';

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
  const base = trimTrailingSlash(process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || DEFAULT_BASE);
  const suffix = p.startsWith('/') ? p : `/${p}`;
  return `${base}${suffix}`;
}
