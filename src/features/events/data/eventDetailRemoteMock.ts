import type { Event as DomainEvent } from '@/src/domain/entities';
import {
  getMockHomeEventApiById,
  isMockHomeFeedEnabled,
} from '@/src/features/events/data/homeFeedMock';
import {
  homeEventItemToEventDetailData,
  mapEventDetailDataToDomain,
} from '@/src/features/events/data/eventDetailRemoteMap';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * When `EXPO_PUBLIC_MOCK_EVENT_DETAIL_API` is unset, defaults to the same flag as home mock
 * so devs do not hit a missing backend. Set to `false` to force the real GET /api/events/:id.
 */
export function shouldMockEventDetailRemote(): boolean {
  const v = process.env.EXPO_PUBLIC_MOCK_EVENT_DETAIL_API?.trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'no') {
    return false;
  }
  if (v === '1' || v === 'true' || v === 'yes') {
    return true;
  }
  return isMockHomeFeedEnabled();
}

/** Simulates network latency + returns a domain event from home mock rows when available. */
export async function fetchMockEventDetailRemote(eventId: string): Promise<DomainEvent | null> {
  await delay(450);
  const item = getMockHomeEventApiById(eventId);
  if (!item) {
    return null;
  }
  const data = homeEventItemToEventDetailData(item);
  return mapEventDetailDataToDomain(data);
}
