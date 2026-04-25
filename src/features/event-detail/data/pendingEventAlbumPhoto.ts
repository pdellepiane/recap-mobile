export type PendingEventAlbumPhoto = {
  uri: string;
  width?: number;
  height?: number;
};

const pendingByEventId = new Map<string, PendingEventAlbumPhoto>();

export function setPendingEventAlbumPhoto(eventId: string, photo: PendingEventAlbumPhoto) {
  pendingByEventId.set(eventId, photo);
}

export function takePendingEventAlbumPhoto(eventId: string): PendingEventAlbumPhoto | null {
  const photo = pendingByEventId.get(eventId) ?? null;
  pendingByEventId.delete(eventId);
  return photo;
}
