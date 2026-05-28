import { useCallback, useEffect, useRef } from 'react';

/**
 * Creates a fresh `AbortController` per operation and aborts all in-flight
 * requests on unmount (or when `abortAll` is called).
 */
export function useAbortController() {
  const controllersRef = useRef<Set<AbortController>>(new Set());

  const beginRequest = useCallback(() => {
    const controller = new AbortController();
    controllersRef.current.add(controller);
    return controller;
  }, []);

  const endRequest = useCallback((controller: AbortController) => {
    controllersRef.current.delete(controller);
  }, []);

  const abortAll = useCallback(() => {
    for (const controller of controllersRef.current) {
      controller.abort();
    }
    controllersRef.current.clear();
  }, []);

  useEffect(() => () => abortAll(), [abortAll]);

  return { beginRequest, endRequest, abortAll };
}
