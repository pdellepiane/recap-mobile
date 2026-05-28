/** Google Maps search URL (web, for WebView or browser). */
export function googleMapsSearchUrl(query: string | null | undefined): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query?.trim() ?? '')}`;
}
