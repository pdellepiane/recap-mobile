import type {
  NotificationApiItem,
  NotificationApiNotifiable,
  NotificationType,
} from '@/src/core/api/types/notifications';
import { resolveApiAssetUrl } from '@/src/core/api/resolveApiAssetUrl';
import type { NotificationItem, NotificationLeading, NotificationMessage } from './notificationItem';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

const TARGET_TAB_BY_TYPE: Partial<Record<NotificationType, EventDetailTab>> = {
  media_liked: EventDetailTab.Album,
  challenge_added: EventDetailTab.Challenges,
  challenge_deadline: EventDetailTab.Challenges,
  ranking_position_changed: EventDetailTab.Ranking,
  event_started: EventDetailTab.Overview,
  event_starting_soon: EventDetailTab.Overview,
  event_recap_active: EventDetailTab.Album,
  media_uploaded: EventDetailTab.Album,
  new_guest_registered: EventDetailTab.Overview,
  challenge_answered: EventDetailTab.Challenges,
  attendance_confirmed: EventDetailTab.Overview,
  challenge_reminder: EventDetailTab.Challenges,
};

function isKnownNotificationType(type: string): type is NotificationType {
  return type in TARGET_TAB_BY_TYPE;
}

function actorName(item: NotificationApiItem): string {
  return item.actor?.name?.trim() ?? '';
}

function actorAvatarUrl(item: NotificationApiItem): string {
  const avatar = item.actor?.avatar?.trim();
  return avatar ? resolveApiAssetUrl(avatar) : '';
}

function iconUrl(item: NotificationApiItem): string {
  const icon = item.icon?.trim();
  return icon ? resolveApiAssetUrl(icon) : '';
}

function notifiableEventName(notifiable: NotificationApiNotifiable | null): string {
  if (notifiable?.type === 'event') {
    return notifiable.name.trim();
  }
  return '';
}

function notifiableEventId(notifiable: NotificationApiNotifiable | null): number | null {
  if (!notifiable) {
    return null;
  }
  if (notifiable.type === 'event') {
    return notifiable.id;
  }
  if (notifiable.type === 'event_media' || notifiable.type === 'event_challenge') {
    return notifiable.event_id;
  }
  return null;
}

function mediaThumbnailUrl(item: NotificationApiItem): string {
  const notifiable = item.notifiable;
  if (notifiable?.type === 'event_media') {
    const path = notifiable.path.trim();
    if (path) {
      return resolveApiAssetUrl(path);
    }
  }
  return iconUrl(item);
}

function resolveEventId(item: NotificationApiItem): string {
  if (item.event_id != null && item.event_id > 0) {
    return String(item.event_id);
  }
  const fromNotifiable = notifiableEventId(item.notifiable);
  return fromNotifiable != null && fromNotifiable > 0 ? String(fromNotifiable) : '';
}

function resolveEventName(item: NotificationApiItem): string {
  const fromNotifiable = notifiableEventName(item.notifiable);
  if (fromNotifiable) {
    return fromNotifiable;
  }
  return item.subject?.trim() ?? '';
}

function parseRankingPosition(data: NotificationApiItem['data']): number | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null;
  }
  const position = data.position;
  if (typeof position === 'number' && Number.isFinite(position)) {
    return position;
  }
  if (typeof position === 'string') {
    const parsed = Number.parseInt(position, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function formatTimeAgo(iso: string): string {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) {
    return '';
  }
  const diffMs = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) {
    return 'Hace un momento';
  }
  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

function fallbackMessage(item: NotificationApiItem): NotificationMessage {
  const body = item.body?.trim() ?? '';
  const subject = item.subject?.trim() ?? '';
  const name = actorName(item);

  if (name && body) {
    return { kind: 'actorThenBody', actorName: name, body };
  }
  if (subject && body) {
    return { kind: 'plain', text: `${subject}: ${body}` };
  }
  return { kind: 'plain', text: body || subject };
}

function mapMessage(item: NotificationApiItem): NotificationMessage {
  const body = item.body?.trim() ?? '';
  const subject = item.subject?.trim() ?? '';
  const name = actorName(item);
  const eventName = resolveEventName(item);

  if (!isKnownNotificationType(item.type)) {
    return fallbackMessage(item);
  }

  switch (item.type) {
    case 'media_liked':
      if (name && body) {
        return { kind: 'prefixedActorThenBody', actorPrefix: 'A ', actorName: name, body };
      }
      return { kind: 'plain', text: body || subject };

    case 'event_started':
      if (name || eventName) {
        return {
          kind: 'prefixActorSuffix',
          prefix: 'Ya inició el evento de ',
          actorName: name || eventName,
          suffix: '',
        };
      }
      return { kind: 'plain', text: body || subject };

    case 'event_starting_soon':
      if (name || eventName) {
        return {
          kind: 'prefixActorSuffix',
          prefix: 'El evento de ',
          actorName: name || eventName,
          suffix: ' está cerca a iniciar',
        };
      }
      return { kind: 'plain', text: body || subject };

    case 'event_recap_active':
      if (name || eventName) {
        return {
          kind: 'prefixThenActor',
          prefix: 'Ya está activo el recuerdo del evento de ',
          actorName: name || eventName,
        };
      }
      return { kind: 'plain', text: body || subject };

    case 'ranking_position_changed': {
      if (body) {
        return { kind: 'plain', text: body };
      }
      const position = parseRankingPosition(item.data);
      if (position != null) {
        return { kind: 'plain', text: `Tu posición en el ranking cambió a #${position}` };
      }
      return { kind: 'plain', text: subject };
    }

    case 'challenge_reminder':
    case 'challenge_added':
    case 'challenge_deadline':
      return { kind: 'plain', text: body || subject };

    case 'media_uploaded':
    case 'new_guest_registered':
    case 'challenge_answered':
    case 'attendance_confirmed':
      if (name && body) {
        return { kind: 'actorThenBody', actorName: name, body };
      }
      return { kind: 'plain', text: body || subject };

    default:
      return fallbackMessage(item);
  }
}

function mapLeading(item: NotificationApiItem): NotificationLeading {
  const colorIndex = Math.abs(item.id) % 6;
  const thumb = mediaThumbnailUrl(item);
  const avatar = actorAvatarUrl(item);

  if (!isKnownNotificationType(item.type)) {
    if (avatar) {
      return { kind: 'avatar', imageUrl: avatar };
    }
    if (thumb) {
      return { kind: 'thumbnail', imageUrl: thumb };
    }
    return { kind: 'initials', colorIndex };
  }

  switch (item.type) {
    case 'media_liked':
      if (avatar && thumb) {
        return {
          kind: 'initialsWithAvatar',
          colorIndex,
          overlayImageUrl: avatar,
        };
      }
      if (avatar) {
        return { kind: 'avatar', imageUrl: avatar };
      }
      return { kind: 'initials', colorIndex };

    case 'event_started':
      if (thumb) {
        return { kind: 'thumbnailWithLive', imageUrl: thumb };
      }
      return { kind: 'initials', colorIndex };

    case 'event_starting_soon':
    case 'event_recap_active':
      if (thumb) {
        return { kind: 'thumbnail', imageUrl: thumb };
      }
      return { kind: 'initials', colorIndex };

    case 'challenge_added':
    case 'challenge_deadline':
    case 'challenge_reminder':
      if (thumb) {
        return { kind: 'thumbnailWithChallenges', imageUrl: thumb };
      }
      return { kind: 'initials', colorIndex };

    case 'media_uploaded':
      if (thumb) {
        return { kind: 'thumbnail', imageUrl: thumb };
      }
      if (avatar) {
        return { kind: 'avatar', imageUrl: avatar };
      }
      return { kind: 'initials', colorIndex };

    case 'new_guest_registered':
    case 'attendance_confirmed':
    case 'challenge_answered':
      if (avatar) {
        return { kind: 'avatar', imageUrl: avatar };
      }
      return { kind: 'initials', colorIndex };

    case 'ranking_position_changed':
      if (avatar) {
        return { kind: 'avatar', imageUrl: avatar };
      }
      return { kind: 'initials', colorIndex };

    default:
      if (avatar) {
        return { kind: 'avatar', imageUrl: avatar };
      }
      if (thumb) {
        return { kind: 'thumbnail', imageUrl: thumb };
      }
      return { kind: 'initials', colorIndex };
  }
}

function mapTargetTab(item: NotificationApiItem): EventDetailTab | undefined {
  if (isKnownNotificationType(item.type)) {
    return TARGET_TAB_BY_TYPE[item.type];
  }

  const action = item.action?.trim().toLowerCase() ?? '';
  if (action.includes('challenge')) {
    return EventDetailTab.Challenges;
  }
  if (action.includes('album') || action.includes('photo') || action.includes('media')) {
    return EventDetailTab.Album;
  }
  if (action.includes('ranking')) {
    return EventDetailTab.Ranking;
  }
  return undefined;
}

export function notificationFromApiItem(item: NotificationApiItem): NotificationItem {
  const eventName = resolveEventName(item);

  return {
    id: String(item.id),
    eventId: resolveEventId(item),
    action: item.action?.trim() || undefined,
    targetTab: mapTargetTab(item),
    isSeen: item.is_read,
    message: mapMessage(item),
    eventName,
    timeAgo: formatTimeAgo(item.created_at),
    leading: mapLeading(item),
    initialsName: actorName(item) || undefined,
  };
}
