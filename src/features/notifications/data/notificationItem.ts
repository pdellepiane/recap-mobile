import type { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

export type NotificationLeading =
  | { kind: 'initials'; colorIndex: number }
  | { kind: 'avatar'; imageUrl: string }
  /** Square profile / event cover (rounded rect). */
  | { kind: 'profileThumbnail'; imageUrl: string }
  | { kind: 'thumbnail'; imageUrl: string }
  | { kind: 'thumbnailWithMessage'; imageUrl: string }
  | { kind: 'thumbnailWithChallenges'; imageUrl: string }
  | { kind: 'thumbnailWithLive'; imageUrl: string }
  | { kind: 'stackedAvatars'; imageUrls: [string, string] }
  | {
      kind: 'initialsWithAvatar';
      colorIndex: number;
      overlayImageUrl: string;
    };

export type NotificationMessage =
  /** **Name** body (guest activity). */
  | { kind: 'actorThenBody'; actorName: string; body: string }
  /** prefix **Name** (memory active). */
  | { kind: 'prefixThenActor'; prefix: string; actorName: string }
  /** prefix **Name** suffix (event started / starting soon). */
  | { kind: 'prefixActorSuffix'; prefix: string; actorName: string; suffix: string }
  /** A **Name** body (photo liked). */
  | { kind: 'prefixedActorThenBody'; actorPrefix: string; actorName: string; body: string }
  /** Full line without a highlighted name (bulk RSVP, host reminders). */
  | { kind: 'plain'; text: string };

export type NotificationItem = {
  id: string;
  eventId: string;
  /** Event detail tab to open on tap (defaults to overview). */
  targetTab?: EventDetailTab;
  isSeen: boolean;
  message: NotificationMessage;
  eventName: string;
  timeAgo: string;
  leading: NotificationLeading;
  /** When leading initials differ from the highlighted name in copy (e.g. photo liked). */
  initialsName?: string;
};

/** Name used for initials-based leading avatars. */
export function notificationInitialsName(item: NotificationItem): string {
  if (item.initialsName?.trim()) {
    return item.initialsName.trim();
  }
  const { message } = item;
  switch (message.kind) {
    case 'actorThenBody':
    case 'prefixThenActor':
    case 'prefixActorSuffix':
    case 'prefixedActorThenBody':
      return message.actorName;
    case 'plain':
      return 'Invitado';
  }
}
