import { EventStoriesScreenPage } from '@/src/features/events/presentation/screens/EventStoriesScreenPage';
import { useLocalSearchParams } from 'expo-router';

export default function EventStoriesRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EventStoriesScreenPage eventId={id ?? ''} />;
}
