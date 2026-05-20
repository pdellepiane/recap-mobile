import { Image as ExpoImage } from 'expo-image';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ImageSourcePropType, ImageURISource } from 'react-native';

type RemoteImageCacheContextValue = {
  epoch: number;
  invalidate: () => Promise<void>;
};

const RemoteImageCacheContext = createContext<RemoteImageCacheContextValue | null>(null);

function isRemoteHttpUri(uri: string): boolean {
  return /^https?:\/\//i.test(uri.trim());
}

export function appendRemoteImageEpoch(uri: string, epoch: number): string {
  const trimmed = uri.trim();
  if (!trimmed || !isRemoteHttpUri(trimmed)) {
    return uri;
  }
  return `${trimmed}${trimmed.includes('?') ? '&' : '?'}refresh=${String(epoch)}`;
}

function patchUriSource(source: ImageURISource, epoch: number): ImageURISource {
  if (!source.uri) {
    return source;
  }
  return {
    ...source,
    uri: appendRemoteImageEpoch(source.uri, epoch),
  };
}

export function withRemoteImageCacheEpoch(
  source: ImageSourcePropType | undefined,
  epoch: number,
): ImageSourcePropType | undefined {
  if (!source) {
    return source;
  }
  if (Array.isArray(source)) {
    return source.map((item) =>
      typeof item === 'number' ? item : patchUriSource(item, epoch),
    ) as ImageSourcePropType;
  }
  if (typeof source === 'number') {
    return source;
  }
  return patchUriSource(source, epoch);
}

export function RemoteImageCacheProvider({ children }: { children: ReactNode }) {
  const [epoch, setEpoch] = useState(0);

  const invalidate = useCallback(async () => {
    try {
      await ExpoImage.clearMemoryCache();
      await ExpoImage.clearDiskCache();
    } catch {
      // no-op
    } finally {
      setEpoch((value) => value + 1);
    }
  }, []);

  const value = useMemo(
    () => ({
      epoch,
      invalidate,
    }),
    [epoch, invalidate],
  );

  return (
    <RemoteImageCacheContext.Provider value={value}>{children}</RemoteImageCacheContext.Provider>
  );
}

export function useRemoteImageCacheEpoch(): number {
  const ctx = useContext(RemoteImageCacheContext);
  if (!ctx) {
    throw new Error('useRemoteImageCacheEpoch must be used within RemoteImageCacheProvider');
  }
  return ctx.epoch;
}

export function useInvalidateRemoteImageCache(): () => Promise<void> {
  const ctx = useContext(RemoteImageCacheContext);
  if (!ctx) {
    throw new Error('useInvalidateRemoteImageCache must be used within RemoteImageCacheProvider');
  }
  return ctx.invalidate;
}
