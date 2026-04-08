/** Album photos on the event detail Album tab. */

export type AlbumPhoto = {
  id: string;
  uri: string;
  /** Width / height ratio for the image `aspectRatio` in RN. */
  aspectRatio: number;
  /** Truncated display name (e.g. "Em…"). */
  authorShort: string;
  authorAvatarUrl?: string;
  likes: number;
};

const TILE_W = 600;

/**
 * Picsum with fixed seed: always returns JPEG (no black gaps from 404s).
 * Motifs may repeat; priority is that images load.
 */
function picsum(id: string, aspectRatio: number): string {
  const h = Math.max(1, Math.round(TILE_W / aspectRatio));
  return `https://picsum.photos/seed/recap-album-${id}/${String(TILE_W)}/${String(h)}`;
}

function picsumAvatar(id: string): string {
  return `https://picsum.photos/seed/recap-av-${id}/64/64`;
}

const ALBUM_BY_EVENT: Record<string, AlbumPhoto[]> = {
  'evt-live-1': [
    {
      id: 'ph1',
      uri: picsum('ph1', 3 / 5),
      aspectRatio: 3 / 5,
      authorShort: 'Em…',
      authorAvatarUrl: picsumAvatar('ph1'),
      likes: 23,
    },
    {
      id: 'ph2',
      uri: picsum('ph2', 5 / 3),
      aspectRatio: 5 / 3,
      authorShort: 'Marc…',
      authorAvatarUrl: picsumAvatar('ph2'),
      likes: 4,
    },
    {
      id: 'ph3',
      uri: picsum('ph3', 4 / 3),
      aspectRatio: 4 / 3,
      authorShort: 'Lau…',
      authorAvatarUrl: picsumAvatar('ph3'),
      likes: 7,
    },
    {
      id: 'ph4',
      uri: picsum('ph4', 3 / 5),
      aspectRatio: 3 / 5,
      authorShort: 'Die…',
      authorAvatarUrl: picsumAvatar('ph4'),
      likes: 13,
    },
    {
      id: 'ph5',
      uri: picsum('ph5', 3 / 5),
      aspectRatio: 3 / 5,
      authorShort: 'Sar…',
      likes: 18,
    },
    {
      id: 'ph6',
      uri: picsum('ph6', 16 / 11),
      aspectRatio: 16 / 11,
      authorShort: 'Ant…',
      authorAvatarUrl: picsumAvatar('ph6'),
      likes: 31,
    },
    {
      id: 'ph7',
      uri: picsum('ph7', 2 / 3),
      aspectRatio: 2 / 3,
      authorShort: 'Val…',
      authorAvatarUrl: picsumAvatar('ph7'),
      likes: 42,
    },
    {
      id: 'ph8',
      uri: picsum('ph8', 16 / 9),
      aspectRatio: 16 / 9,
      authorShort: 'Ric…',
      likes: 9,
    },
    {
      id: 'ph9',
      uri: picsum('ph9', 1),
      aspectRatio: 1,
      authorShort: 'Nad…',
      authorAvatarUrl: picsumAvatar('ph9'),
      likes: 56,
    },
    {
      id: 'ph10',
      uri: picsum('ph10', 3 / 4),
      aspectRatio: 3 / 4,
      authorShort: 'Leo…',
      likes: 3,
    },
    {
      id: 'ph11',
      uri: picsum('ph11', 5 / 4),
      aspectRatio: 5 / 4,
      authorShort: 'Car…',
      authorAvatarUrl: picsumAvatar('ph11'),
      likes: 88,
    },
    {
      id: 'ph12',
      uri: picsum('ph12', 3 / 5),
      aspectRatio: 3 / 5,
      authorShort: 'Ire…',
      likes: 15,
    },
    {
      id: 'ph13',
      uri: picsum('ph13', 4 / 5),
      aspectRatio: 4 / 5,
      authorShort: 'Fer…',
      authorAvatarUrl: picsumAvatar('ph13'),
      likes: 27,
    },
    {
      id: 'ph14',
      uri: picsum('ph14', 16 / 10),
      aspectRatio: 16 / 10,
      authorShort: 'Gio…',
      likes: 61,
    },
    {
      id: 'ph15',
      uri: picsum('ph15', 2 / 3),
      aspectRatio: 2 / 3,
      authorShort: 'Pau…',
      authorAvatarUrl: picsumAvatar('ph15'),
      likes: 19,
    },
    {
      id: 'ph16',
      uri: picsum('ph16', 11 / 16),
      aspectRatio: 11 / 16,
      authorShort: 'Eli…',
      likes: 44,
    },
    {
      id: 'ph17',
      uri: picsum('ph17', 6 / 5),
      aspectRatio: 6 / 5,
      authorShort: 'Mig…',
      likes: 6,
    },
    {
      id: 'ph18',
      uri: picsum('ph18', 9 / 16),
      aspectRatio: 9 / 16,
      authorShort: 'Sol…',
      authorAvatarUrl: picsumAvatar('ph18'),
      likes: 72,
    },
  ],
};

export function getEventAlbum(eventId: string): AlbumPhoto[] {
  return ALBUM_BY_EVENT[eventId] ?? ALBUM_BY_EVENT['evt-live-1'] ?? [];
}
