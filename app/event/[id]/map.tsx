import { EventMapScreenPage } from '@/src/features/events/presentation/screens/EventMapScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventMapRoute() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string | string[] }>();

  return <EventMapScreenPage eventId={id ?? ''} initialQuery={firstString(q)} />;
}
