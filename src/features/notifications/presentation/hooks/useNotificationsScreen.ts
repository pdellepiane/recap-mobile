import { defaultTabForNotification } from '../../data/notificationNavigation';
import type { NotificationItem } from '../../data/notificationItem';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import { notificationRepository } from '@/src/core/di/container';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

/**
 * Notifications tab: loads from GET /api/user/notifications and handles navigation on tap.
 */
export function useNotificationsScreen(): {
  items: NotificationItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  onNotificationPress: (item: NotificationItem) => void;
  onRefresh: () => void;
} {
  const { goToEventDetail } = useCoordinator();
  const { beginRequest, endRequest } = useAbortController();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadGenerationRef = useRef(0);

  const loadNotifications = useCallback(async (mode: 'initial' | 'refresh') => {
    const controller = beginRequest();
    const generation = ++loadGenerationRef.current;

    if (mode === 'initial') {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const result = await notificationRepository.fetchNotifications(
        { page: 1 },
        { signal: controller.signal },
      );
      if (generation !== loadGenerationRef.current) {
        return;
      }
      setItems(result.items);
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
    }
  }, [beginRequest, endRequest]);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications('initial');
    }, [loadNotifications]),
  );

  const onRefresh = useCallback(() => {
    void loadNotifications('refresh');
  }, [loadNotifications]);

  const onNotificationPress = useCallback(
    (item: NotificationItem) => {
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, isSeen: true } : row)),
      );
      if (!item.eventId) {
        return;
      }
      goToEventDetail(item.eventId, defaultTabForNotification(item));
    },
    [goToEventDetail],
  );

  return { items, isLoading, isRefreshing, onNotificationPress, onRefresh };
}
