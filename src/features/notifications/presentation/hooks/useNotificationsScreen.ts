import type { NotificationItem } from '../../data/notificationItem';
import type { FetchNotificationsResult } from '../../data/repositories/NotificationRepository';
import { notificationRepository } from '@/src/core/di/container';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

const notificationsQueryKey = ['notifications'] as const;

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

function flattenNotificationPages(
  data: InfiniteData<FetchNotificationsResult, unknown> | undefined,
): NotificationItem[] {
  return (
    data?.pages.reduce<NotificationItem[]>(
      (current, page) => mergeNotifications(current, page.items),
      [],
    ) ?? []
  );
}

function markNotificationAsSeen(
  data: InfiniteData<FetchNotificationsResult, unknown> | undefined,
  notificationId: string,
): InfiniteData<FetchNotificationsResult, unknown> | undefined {
  if (!data) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.id === notificationId ? { ...item, isSeen: true } : item,
      ),
    })),
  };
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
  const queryClient = useQueryClient();
  const hasFocusedOnceRef = useRef(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: notificationsQueryKey,
    queryFn: ({ pageParam, signal }) =>
      notificationRepository.fetchNotifications({ page: pageParam }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.currentPage + 1 : undefined),
  });
  const items = useMemo(() => flattenNotificationPages(data), [data]);
  const { mutate: markRead } = useMutation({
    mutationFn: (notificationId: string) =>
      notificationRepository.markNotificationRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previous =
        queryClient.getQueryData<InfiniteData<FetchNotificationsResult, unknown>>(
          notificationsQueryKey,
        );
      queryClient.setQueryData<InfiniteData<FetchNotificationsResult, unknown>>(
        notificationsQueryKey,
        (data) => markNotificationAsSeen(data, notificationId),
      );
      return { previous };
    },
    onError: (e, _notificationId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationsQueryKey, context.previous);
      }
      if (__DEV__) {
        console.error('[useNotificationsScreen] mark read failed', e);
      }
    },
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetching) {
      return;
    }
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  const onNotificationPress = useCallback(
    (item: NotificationItem) => {
      markRead(item.id);
      if (item.action) {
        goToPushRedirect(item.action);
        return;
      }
    },
    [goToPushRedirect, markRead],
  );

  return {
    items,
    isLoading: isPending && items.length === 0,
    isRefreshing: isRefetching && !isFetchingNextPage,
    isLoadingMore: isFetchingNextPage,
    onNotificationPress,
    onRefresh,
    onLoadMore,
  };
}
