/** In-memory JWT for Bearer requests; replace with secure storage when wiring production auth. */
let accessToken: string | null = null;

export function getAuthAccessToken(): string | null {
  return accessToken;
}

export function setAuthAccessToken(token: string | null): void {
  accessToken = token;
}
