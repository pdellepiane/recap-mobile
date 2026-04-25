import { EventDetailCameraScreenPage } from '@/src/features/event-detail/presentation/screens/EventDetailCameraScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventDetailCameraRoute() {
  const { id, title } = useLocalSearchParams<{
    id: string;
    title?: string | string[];
  }>();

  return <EventDetailCameraScreenPage eventId={id ?? ''} eventTitle={firstString(title)} />;
}
