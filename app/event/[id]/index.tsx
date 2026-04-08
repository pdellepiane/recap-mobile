import { EventDetailTab } from '@/src/features/events/presentation/hooks/useEventDetailScreen';
import { EventDetailScreenPage } from '@/src/features/events/presentation/screens/EventDetailScreenPage';
import { useLocalSearchParams } from 'expo-router';

function firstQuery(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventDetailRoute() {
  const { id, tab, completedChallengeId, points } = useLocalSearchParams<{
    id: string | string[];
    tab?: string | string[];
    completedChallengeId?: string | string[];
    points?: string | string[];
  }>();

  const eventId = firstQuery(id) ?? '';
  const tabParam = firstQuery(tab);
  const completedId = firstQuery(completedChallengeId);
  const pointsStr = firstQuery(points);
  const pointsNum = pointsStr !== undefined ? Number(pointsStr) : undefined;

  const initialTab = parseEventDetailTab(tabParam);

  return (
    <EventDetailScreenPage
      eventId={eventId}
      initialTab={initialTab}
      completedChallengeId={completedId}
      completedPoints={
        typeof pointsNum === 'number' && Number.isFinite(pointsNum) ? pointsNum : undefined
      }
    />
  );
}

function parseEventDetailTab(tab: string | undefined): EventDetailTab | undefined {
  switch (tab) {
    case EventDetailTab.Overview:
    case EventDetailTab.Challenges:
    case EventDetailTab.Ranking:
    case EventDetailTab.Album:
      return tab;
    default:
      return undefined;
  }
}
