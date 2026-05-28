/** True when a fetch was cancelled via `AbortSignal` (not a server/network failure). */
export function isAbortError(error: unknown): error is Error {
  return error instanceof Error && error.name === 'AbortError';
}
