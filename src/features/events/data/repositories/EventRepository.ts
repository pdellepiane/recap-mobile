import { homePaths } from '@/src/core/api/paths';
import type {
  HomeBannerItem,
  HomeBannersListResponse,
  HomeEventItem,
  HomeEventsListResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import type { Event } from '@/src/domain/entities';
import { mapHomeEventApiItemToDomain } from '@/src/features/events/data/homeFeedMap';
import {
  MOCK_HOME_BANNERS,
  MOCK_HOME_GUEST_EVENTS,
  MOCK_HOME_HOST_EVENTS,
  getMockHomeEventApiById,
  isMockHomeFeedEnabled,
} from '@/src/features/events/data/homeFeedMock';

function parseHomeEventsBody(res: HomeEventsListResponse): Event[] {
  if (!res.status || !Array.isArray(res.data)) {
    return [];
  }
  return res.data.map(mapHomeEventApiItemToDomain);
}

function parseHomeBannersBody(res: HomeBannersListResponse): HomeBannerItem[] {
  if (!res.status || !Array.isArray(res.data)) {
    return [];
  }
  return res.data;
}

function mapMockEvents(items: HomeEventItem[]): Event[] {
  return items.map(mapHomeEventApiItemToDomain);
}

/**
 * Events: authenticated home lists use {@link FetchHttpClient}; legacy `/events/:id` stays on mock until the detail API exists.
 *
 * Set `EXPO_PUBLIC_MOCK_HOME_FEED=true` (or `1` / `yes`) to skip home list requests and use `homeFeedMock.ts` data for local UI testing.
 */
export class EventRepository {
  constructor(
    private readonly api: HttpClient,
    private readonly legacyMock: HttpClient,
  ) {}

  /** GET /api/home/host-events — “Mis eventos” (hosted). */
  async getHostEvents(): Promise<Event[]> {
    if (isMockHomeFeedEnabled()) {
      return mapMockEvents(MOCK_HOME_HOST_EVENTS);
    }
    const res = await this.api.get<HomeEventsListResponse>(homePaths.hostEvents, { auth: 'bearer' });
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/guest-events — “Planes” (guest). */
  async getGuestEvents(): Promise<Event[]> {
    if (isMockHomeFeedEnabled()) {
      return mapMockEvents(MOCK_HOME_GUEST_EVENTS);
    }
    const res = await this.api.get<HomeEventsListResponse>(homePaths.guestEvents, { auth: 'bearer' });
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/banners — top slider (host/guest events, deduped; includes `no_event` fallback). */
  async getHomeBanners(): Promise<HomeBannerItem[]> {
    if (isMockHomeFeedEnabled()) {
      return MOCK_HOME_BANNERS;
    }
    const res = await this.api.get<HomeBannersListResponse>(homePaths.banners, { auth: 'bearer' });
    return parseHomeBannersBody(res);
  }

  async getEventById(eventId: string): Promise<Event> {
    if (isMockHomeFeedEnabled()) {
      const mock = getMockHomeEventApiById(eventId);
      if (mock) {
        return mapHomeEventApiItemToDomain(mock);
      }
    }
    return this.legacyMock.get<Event>(`/events/${eventId}`);
  }
}
