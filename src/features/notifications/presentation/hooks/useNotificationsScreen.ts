import { defaultTabForNotification } from '../../data/notificationNavigation';
import { TEMP_NOTIFICATION_ITEMS } from '../../data/notificationMocks';
import type { NotificationItem } from '../../data/notificationItem';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useState } from 'react';

/**
 * Notifications tab state. TODO(backend): GET notifications API + persist read state.
 */
export function useNotificationsScreen(): {
  items: NotificationItem[];
  onNotificationPress: (item: NotificationItem) => void;
} {
  const { goToEventDetail } = useCoordinator();
  const [items, setItems] = useState(TEMP_NOTIFICATION_ITEMS);

  const onNotificationPress = useCallback(
    (item: NotificationItem) => {
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, isSeen: true } : row)),
      );
      goToEventDetail(item.eventId, defaultTabForNotification(item));
    },
    [goToEventDetail],
  );

  return { items, onNotificationPress };
}
