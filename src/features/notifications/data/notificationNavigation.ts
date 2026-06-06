import type { NotificationItem } from './notificationItem';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

/** Default event-detail tab when a notification is opened. */
export function defaultTabForNotification(item: NotificationItem): EventDetailTab {
  if (item.targetTab) {
    return item.targetTab;
  }
  return EventDetailTab.Overview;
}
