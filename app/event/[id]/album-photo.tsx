import { EventAlbumPhotoScreenPage } from '@/src/features/event-detail/presentation/screens/EventAlbumPhotoScreenPage';
import { firstRouteParam } from '@/src/features/event-detail/presentation/utils/quizCreateRouteParams';
import { useLocalSearchParams } from 'expo-router';

export default function EventAlbumPhotoRoute() {
  const { id, mediaId } = useLocalSearchParams<{
    id?: string | string[];
    mediaId?: string | string[];
  }>();

  return (
    <EventAlbumPhotoScreenPage
      eventId={firstRouteParam(id) ?? ''}
      mediaId={firstRouteParam(mediaId) ?? ''}
    />
  );
}
