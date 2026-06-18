import type { NotificationItem } from '../../data/notificationItem';
import { notificationRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

function mergeNotifications(
  current: NotificationItem[],
  incoming: NotificationItem[],
): NotificationItem[] {
  if (incoming.length === 0) {
    return current;
  }
  const seen = new Set(current.map((item) => item.id));
  const next = [...current];
  for (const item of incoming) {
    if (!seen.has(item.id)) {
      next.push(item);
      seen.add(item.id);
    }
  }
  return next;
}

/**
 * Notifications tab: paginated notifications and navigation on tap.
 */
export function useNotificationsScreen(): {
  items: NotificationItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  onNotificationPress: (item: NotificationItem) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
} {
  const { goToPushRedirect } = useCoordinator();
  const { beginRequest, endRequest } = useAbortController();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadGenerationRef = useRef(0);
  const loadMoreGenerationRef = useRef(0);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const applyPageResult = useCallback(
    (
      incoming: NotificationItem[],
      hasMore: boolean,
      currentPage: number,
      mode: 'replace' | 'append',
    ) => {
      pageRef.current = currentPage;
      hasMoreRef.current = hasMore;
      setItems((current) =>
        mode === 'replace' ? incoming : mergeNotifications(current, incoming),
      );
    },
    [],
  );

  const loadPage = useCallback(
    async (
      page: number,
      mode: 'replace' | 'append',
      opts?: { signal?: AbortSignal; generation?: number; loadMoreGeneration?: number },
    ) => {
      const result = await notificationRepository.fetchNotifications(
        { page },
        { signal: opts?.signal },
      );
      if (opts?.signal?.aborted) {
        return;
      }
      if (opts?.generation != null && opts.generation !== loadGenerationRef.current) {
        return;
      }
      if (
        opts?.loadMoreGeneration != null &&
        opts.loadMoreGeneration !== loadMoreGenerationRef.current
      ) {
        return;
      }
      applyPageResult(result.items, result.hasMore, result.currentPage, mode);
    },
    [applyPageResult],
  );

  const loadNotifications = useCallback(
    async (mode: 'initial' | 'refresh' | 'append') => {
      const controller = beginRequest();
      const generation =
        mode === 'append' ? loadGenerationRef.current : ++loadGenerationRef.current;
      const loadMoreGeneration =
        mode === 'append' ? ++loadMoreGenerationRef.current : loadMoreGenerationRef.current;

      if (mode !== 'append') {
        loadMoreGenerationRef.current += 1;
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }

      if (mode === 'initial') {
        setIsLoading(true);
      } else if (mode === 'refresh') {
        setIsRefreshing(true);
      } else {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      try {
        const page = mode === 'append' ? pageRef.current + 1 : 1;
        const listMode = mode === 'append' ? 'append' : 'replace';
        await loadPage(page, listMode, {
          signal: controller.signal,
          generation: mode === 'append' ? undefined : generation,
          loadMoreGeneration: mode === 'append' ? loadMoreGeneration : undefined,
        });
      } catch (e) {
        if (isAbortError(e) || generation !== loadGenerationRef.current) {
          return;
        }
        if (__DEV__) {
          console.error('[useNotificationsScreen] load failed', e);
        }
      } finally {
        endRequest(controller);
        if (generation === loadGenerationRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
        if (mode === 'append' && loadMoreGeneration === loadMoreGenerationRef.current) {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      }
    },
    [beginRequest, endRequest, loadPage],
  );

  useFocusEffect(
    useCallback(() => {
      loadNotifications('initial');
    }, [loadNotifications]),
  );

  const onRefresh = useCallback(() => {
    loadNotifications('refresh');
  }, [loadNotifications]);

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isLoadingMoreRef.current || isLoading || isRefreshing) {
      return;
    }
    loadNotifications('append');
  }, [isLoading, isRefreshing, loadNotifications]);

  const onNotificationPress = useCallback(
    (item: NotificationItem) => {
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, isSeen: true } : row)),
      );
      if (item.action) {
        goToPushRedirect(item.action);
        return;
      }
    },
    [goToPushRedirect],
  );

  return {
    items,
    isLoading,
    isRefreshing,
    isLoadingMore,
    onNotificationPress,
    onRefresh,
    onLoadMore,
  };
}
