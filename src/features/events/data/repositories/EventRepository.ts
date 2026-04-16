import { eventPaths, homePaths } from '@/src/core/api/paths';
import type {
  EventDetailApiResponse,
  EventRankingListResponse,
  HomeBannerItem,
  HomeBannersListResponse,
  HomeEventItem,
  HomeEventsListResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import type { Event as DomainEvent } from '@/src/domain/entities';
import { mapEventDetailDataToDomain } from '@/src/features/events/data/eventDetailRemoteMap';
import {
  fetchMockEventDetailRemote,
  shouldMockEventDetailRemote,
} from '@/src/features/events/data/eventDetailRemoteMock';
import { mapRankingApiItemsToRows } from '@/src/features/events/data/eventRankingMap';
import { fetchMockEventRankingRemote } from '@/src/features/events/data/eventRankingRemoteMock';
import { getCachedHomeEvent } from '@/src/features/events/data/homeEventCache';
import { mapHomeEventApiItemToDomain } from '@/src/features/events/data/homeFeedMap';
import {
  MOCK_HOME_BANNERS,
  MOCK_HOME_GUEST_EVENTS,
  MOCK_HOME_HOST_EVENTS,
  getMockHomeEventApiById,
  isMockHomeFeedEnabled,
} from '@/src/features/events/data/homeFeedMock';
import type { RankingRow } from '@/src/features/events/presentation/data/eventRanking';

function parseHomeEventsBody(res: HomeEventsListResponse): DomainEvent[] {
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

function mapMockEvents(items: HomeEventItem[]): DomainEvent[] {
  return items.map(mapHomeEventApiItemToDomain);
}

/**
 * Events: home lists use {@link FetchHttpClient}; detail merges home cache + GET /api/events/:id (or mock).
 *
 * Set `EXPO_PUBLIC_MOCK_HOME_FEED=true` for home list mocks. Remote detail mock follows
 * `EXPO_PUBLIC_MOCK_EVENT_DETAIL_API` or defaults to the same home flag; set it to `false` to hit the real API.
 */
export class EventRepository {
  constructor(
    private readonly api: HttpClient,
    private readonly legacyMock: HttpClient,
  ) {}

  /** Snapshot from last home feed or home-shaped mock — instant detail paint. */
  getLocalEventById(eventId: string): DomainEvent | null {
    const cached = getCachedHomeEvent(eventId);
    if (cached) {
      return cached;
    }
    if (isMockHomeFeedEnabled()) {
      const row = getMockHomeEventApiById(eventId);
      if (row) {
        return mapHomeEventApiItemToDomain(row);
      }
    }
    return null;
  }

  /**
   * GET /api/events/:id (Bearer) or mock delay + payload when {@link shouldMockEventDetailRemote} is true.
   */
  async fetchRemoteEventDetail(eventId: string): Promise<DomainEvent | null> {
    if (shouldMockEventDetailRemote()) {
      return fetchMockEventDetailRemote(eventId);
    }
    try {
      const res = await this.api.get<EventDetailApiResponse>(eventPaths.detail(eventId), {
        auth: 'bearer',
      });
      if (!res.status || !res.data) {
        return null;
      }
      return mapEventDetailDataToDomain(res.data);
    } catch {
      return null;
    }
  }

  /**
   * GET /api/events/:id/ranking (Bearer) or mock leaderboard when {@link shouldMockEventDetailRemote} is true.
   */
  async fetchEventRankingRemote(eventId: string): Promise<RankingRow[] | null> {
    if (shouldMockEventDetailRemote()) {
      return fetchMockEventRankingRemote(eventId);
    }
    try {
      const res = await this.api.get<EventRankingListResponse>(eventPaths.ranking(eventId), {
        auth: 'bearer',
      });
      if (!res.status || !Array.isArray(res.data)) {
        return null;
      }
      return mapRankingApiItemsToRows(res.data, { assignMockAvatars: false });
    } catch {
      return null;
    }
  }

  /** Legacy mock transport (`evt-live-*`, etc.). */
  async getEventByIdLegacy(eventId: string): Promise<DomainEvent> {
    return this.legacyMock.get<DomainEvent>(`/events/${eventId}`);
  }

  /** Prefer local snapshot, then home mock row, then legacy mock list. */
  async getEventById(eventId: string): Promise<DomainEvent> {
    const local = this.getLocalEventById(eventId);
    if (local) {
      return local;
    }
    if (isMockHomeFeedEnabled()) {
      const row = getMockHomeEventApiById(eventId);
      if (row) {
        return mapHomeEventApiItemToDomain(row);
      }
    }
    return this.getEventByIdLegacy(eventId);
  }

  /** GET /api/home/host-events — “Mis eventos” (hosted). */
  async getHostEvents(): Promise<DomainEvent[]> {
    if (isMockHomeFeedEnabled()) {
      return mapMockEvents(MOCK_HOME_HOST_EVENTS);
    }
    const res = await this.api.get<HomeEventsListResponse>(homePaths.hostEvents, { auth: 'bearer' });
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/guest-events — “Planes” (guest). */
  async getGuestEvents(): Promise<DomainEvent[]> {
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
}
