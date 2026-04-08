import { InAppWebScreenPage } from '@/src/ui/InAppWebScreenPage';
import { useLocalSearchParams } from 'expo-router';

const DEFAULT_URI = 'https://sinenvolturas.com';
const ALLOWED_HOST_SUFFIX = 'sinenvolturas.com';

function getSingleParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function sanitizeInAppWebUri(raw: string | undefined): string {
  if (!raw) return DEFAULT_URI;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return DEFAULT_URI;
  }
  try {
    const u = new URL(decoded);
    if (u.protocol !== 'https:') return DEFAULT_URI;
    const host = u.hostname.toLowerCase();
    if (host !== ALLOWED_HOST_SUFFIX && !host.endsWith(`.${ALLOWED_HOST_SUFFIX}`)) {
      return DEFAULT_URI;
    }
    return u.toString();
  } catch {
    return DEFAULT_URI;
  }
}

/**
 * Root-level modal: in-app browser for approved HTTPS URLs (Sin Envolturas by default).
 */
export default function InAppWebModalRoute() {
  const { url } = useLocalSearchParams<{ url?: string }>();
  const uri = sanitizeInAppWebUri(getSingleParam(url));

  return <InAppWebScreenPage uri={uri} title="Sin Envolturas" />;
}
