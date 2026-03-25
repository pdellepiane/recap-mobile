import { useLocalSearchParams } from 'expo-router';

import { EventDetailScreenPage } from '@/src/features/events/presentation/screens/EventDetailScreenPage';

export default function EventDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EventDetailScreenPage eventId={id ?? ''} />;
}
