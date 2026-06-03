import type { NotificationItem } from './notificationItem';
import { EventDetailTab } from '@/src/features/event-detail/presentation/hooks/eventDetailTabs';

const WEDDING_THUMB = 'https://picsum.photos/seed/recap-notif-wedding/200/200';
const BIRTHDAY_THUMB = 'https://picsum.photos/seed/recap-notif-birthday/200/200';
const AVATAR_A = 'https://i.pravatar.cc/150?img=12';
const AVATAR_B = 'https://i.pravatar.cc/150?img=32';

const EVENT_PEPSI = '35201';
const EVENT_SILVA = '35202';
const EVENT_BIRTHDAY = '35203';

/** Temporary preview data — TODO(backend): remove when GET notifications API is wired. */
export const TEMP_NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 'scenario-bulk-rsvp',
    eventId: EVENT_PEPSI,
    targetTab: EventDetailTab.Overview,
    isSeen: true,
    message: {
      kind: 'plain',
      text: 'Mario Bros, Jessika Walsh y 12 personas más confirmaron asistencia a tu evento',
    },
    eventName: 'Boda de Pepsi & Coca',
    timeAgo: 'Hace 5 h',
    leading: { kind: 'stackedAvatars', imageUrls: [AVATAR_A, AVATAR_B] },
  },
  {
    id: 'scenario-challenges-reminder',
    eventId: EVENT_SILVA,
    targetTab: EventDetailTab.Challenges,
    isSeen: true,
    message: {
      kind: 'plain',
      text: 'No olvides agregar retos de preguntas y fotos a tu evento',
    },
    eventName: 'Boda de Silva & Manuel',
    timeAgo: 'Hace 2 d',
    leading: { kind: 'thumbnailWithChallenges', imageUrl: WEDDING_THUMB },
  },
  {
    id: 'scenario-memory-active',
    eventId: EVENT_SILVA,
    targetTab: EventDetailTab.Album,
    isSeen: true,
    message: {
      kind: 'prefixThenActor',
      prefix: 'Ya está activo el recuerdo del evento de ',
      actorName: 'Silvana Mendez',
    },
    eventName: 'Boda de Silva & Manuel',
    timeAgo: 'Hace 3 h',
    leading: { kind: 'thumbnail', imageUrl: WEDDING_THUMB },
  },
  {
    id: 'scenario-event-invitation',
    eventId: EVENT_SILVA,
    targetTab: EventDetailTab.Overview,
    isSeen: true,
    message: {
      kind: 'actorThenBody',
      actorName: 'Silvana Mendez',
      body: 'te invito a un evento',
    },
    eventName: 'Boda de Silva & Manuel',
    timeAgo: 'Hace 3 h',
    leading: { kind: 'profileThumbnail', imageUrl: WEDDING_THUMB },
  },
  {
    id: 'scenario-event-starting-soon',
    eventId: EVENT_BIRTHDAY,
    targetTab: EventDetailTab.Overview,
    isSeen: false,
    message: {
      kind: 'prefixActorSuffix',
      prefix: 'El evento de ',
      actorName: 'Juliana Flores',
      suffix: ' está cerca a iniciar',
    },
    eventName: 'Cumpleaños 30 de Juliana',
    timeAgo: 'Hace 7 h',
    leading: { kind: 'thumbnail', imageUrl: BIRTHDAY_THUMB },
  },
  {
    id: 'scenario-event-started',
    eventId: EVENT_BIRTHDAY,
    targetTab: EventDetailTab.Overview,
    isSeen: false,
    message: {
      kind: 'prefixActorSuffix',
      prefix: 'Ya inició el evento de ',
      actorName: 'Juliana Flores',
      suffix: '',
    },
    eventName: 'Cumpleaños 30 de Juliana',
    timeAgo: 'Hace 4 h',
    leading: { kind: 'thumbnailWithLive', imageUrl: BIRTHDAY_THUMB },
  },
  {
    id: 'scenario-photo-liked',
    eventId: EVENT_PEPSI,
    targetTab: EventDetailTab.Album,
    isSeen: false,
    initialsName: 'Ana Brooks',
    message: {
      kind: 'prefixedActorThenBody',
      actorPrefix: 'A ',
      actorName: 'Jessika Walsh',
      body: 'le gusta la foto que subiste',
    },
    eventName: 'Boda de Pepsi & Coca',
    timeAgo: 'Hace 20 min',
    leading: {
      kind: 'initialsWithAvatar',
      colorIndex: 0,
      overlayImageUrl: 'https://i.pravatar.cc/150?img=47',
    },
  },
  {
    id: 'guest-photo-upload',
    eventId: EVENT_PEPSI,
    targetTab: EventDetailTab.Album,
    isSeen: false,
    message: {
      kind: 'actorThenBody',
      actorName: 'Juliana Flores',
      body: 'subió fotos a tu recuerdo del evento',
    },
    eventName: 'Boda de Pepsi & Coca',
    timeAgo: 'Hace 20 min',
    leading: { kind: 'initials', colorIndex: 0 },
  },
  {
    id: 'guest-joined',
    eventId: EVENT_PEPSI,
    targetTab: EventDetailTab.Overview,
    isSeen: true,
    message: {
      kind: 'actorThenBody',
      actorName: 'Silvana Mendez',
      body: 'también se unió a la lista de asistentes confirmados',
    },
    eventName: 'Boda de Pepsi & Coca',
    timeAgo: 'Hace 57 min',
    leading: { kind: 'avatar', imageUrl: 'https://i.pravatar.cc/150?img=5' },
  },
  {
    id: 'guest-photo-thumb',
    eventId: EVENT_PEPSI,
    targetTab: EventDetailTab.Album,
    isSeen: true,
    message: {
      kind: 'actorThenBody',
      actorName: 'Juliana Flores',
      body: 'subió fotos a tu recuerdo del evento',
    },
    eventName: 'Boda de Pepsi & Coca',
    timeAgo: 'Hace 1 h',
    leading: { kind: 'thumbnail', imageUrl: WEDDING_THUMB },
  },
  {
    id: 'guest-left',
    eventId: EVENT_SILVA,
    targetTab: EventDetailTab.Overview,
    isSeen: true,
    message: {
      kind: 'actorThenBody',
      actorName: 'Silvana Mendez',
      body: 'dejó el evento',
    },
    eventName: 'Boda de Silva & Manuel',
    timeAgo: 'Hace 2 h',
    leading: { kind: 'initials', colorIndex: 2 },
  },
  {
    id: 'guest-message-photos',
    eventId: EVENT_SILVA,
    targetTab: EventDetailTab.Album,
    isSeen: false,
    message: {
      kind: 'actorThenBody',
      actorName: 'Silvana Mendez',
      body: 'te dejó un mensaje junto con fotos del evento',
    },
    eventName: 'Boda de Silva & Manuel',
    timeAgo: 'Hace 3 h',
    leading: { kind: 'thumbnailWithMessage', imageUrl: WEDDING_THUMB },
  },
];
