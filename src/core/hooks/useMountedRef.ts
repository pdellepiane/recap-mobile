import { useEffect, useRef } from 'react';

/** Ref that is `true` while the component is mounted (for guarding async setState). */
export function useMountedRef() {
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return mountedRef;
}
