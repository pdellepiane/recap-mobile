import type { NotificationItem } from './notificationItem';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

/** Horizontal inset for notification rows and dividers. */
export const NOTIFICATION_LIST_HORIZONTAL_PADDING = 20;

/** Default event-detail tab when a notification is opened. */
export function defaultTabForNotification(item: NotificationItem): EventDetailTab {
  if (item.targetTab) {
    return item.targetTab;
  }
  return EventDetailTab.Overview;
}
