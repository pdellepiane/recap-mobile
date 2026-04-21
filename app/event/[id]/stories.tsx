import { EventStoriesScreenPage } from '@/src/features/event-detail/presentation/screens/EventStoriesScreenPage';
import { useLocalSearchParams } from 'expo-router';

export default function EventStoriesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EventStoriesScreenPage eventId={id ?? ''} />;
}
