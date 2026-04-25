import { normalizeChallengesFromApi } from '../eventChallengesMap';
import { seedEventChallengeQuizzesFromApi } from '../eventChallengesQuizSeed';
import { mapEventDetailDataToDomain } from '../eventDetailRemoteMap';
import { mapEventMediaApiToAlbumPhotos } from '../eventMediaMap';
import { mapRankingApiItemsToRows } from '../eventRankingMap';
import { getCachedHomeEvent } from '../homeEventCache';
import { mapHomeEventApiItemToDomain } from '../homeFeedMap';
import { eventPaths, homePaths } from '@/src/core/api/paths';
import type {
  EventChallengesListResponse,
  EventDetailApiResponse,
  EventMediaListResponse,
  EventRankingListResponse,
  EventReactionKind,
  EventReactionPostResponse,
  HomeBannerItem,
  HomeBannersListResponse,
  HomeEventsListResponse,
} from '@/src/core/api/types';
import type { HttpClient } from '@/src/core/http/HttpClient';
import type { Event as DomainEvent } from '@/src/domain/entities';
import type { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import {
  cacheEventChallengesFromRemote,
  getEventChallenges,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';
import type { RankingRow } from '@/src/features/event-detail/data/eventRanking';

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

/**
 * Events: home lists and detail use {@link FetchHttpClient} against `EXPO_PUBLIC_API_BASE_URL`.
 * Detail merges the home cache snapshot with GET /api/events/:id.
 */
export class EventRepository {
  constructor(private readonly api: HttpClient) {}

  /** Snapshot from the last home feed fetch — instant detail paint before remote returns. */
  getLocalEventById(eventId: string): DomainEvent | null {
    const cached = getCachedHomeEvent(eventId);
    return cached ?? null;
  }

  /** GET /api/events/:id (Bearer). */
  async fetchRemoteEventDetail(eventId: string): Promise<DomainEvent | null> {
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

  /** POST /api/events/:id/reactions (Bearer). */
  async postEventReaction(eventId: string, reaction: EventReactionKind): Promise<boolean> {
    try {
      const res = await this.api.post<EventReactionPostResponse>(
        eventPaths.reactions(eventId),
        { reaction },
        { auth: 'bearer' },
      );
      return Boolean(res.status);
    } catch {
      return false;
    }
  }

  /** GET /api/events/:id/ranking (Bearer). */
  async fetchEventRankingRemote(eventId: string): Promise<RankingRow[] | null> {
    try {
      const res = await this.api.get<EventRankingListResponse>(eventPaths.ranking(eventId), {
        auth: 'bearer',
      });
      if (!res.status || !Array.isArray(res.data)) {
        return null;
      }
      return mapRankingApiItemsToRows(res.data);
    } catch {
      return null;
    }
  }

  /** GET /api/events/:id/media — album grid (Bearer). */
  async fetchEventMedia(eventId: string): Promise<AlbumPhoto[]> {
    try {
      const res = await this.api.get<EventMediaListResponse>(eventPaths.media(eventId), {
        auth: 'bearer',
      });
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return mapEventMediaApiToAlbumPhotos(res.data);
    } catch {
      return [];
    }
  }

  /** GET /api/events/:id/challenges (Bearer). */
  async fetchEventChallenges(eventId: string): Promise<EventChallenge[]> {
    try {
      const res = await this.api.get<EventChallengesListResponse>(eventPaths.challenges(eventId), {
        auth: 'bearer',
      });
      if (!res.status || !Array.isArray(res.data)) {
        return getEventChallenges(eventId);
      }
      seedEventChallengeQuizzesFromApi(res.data);
      const mapped = normalizeChallengesFromApi(res.data);
      cacheEventChallengesFromRemote(eventId, mapped);
      return mapped;
    } catch {
      return getEventChallenges(eventId);
    }
  }

  /** GET /api/home/host-events — “Mis eventos” (hosted). */
  async getHostEvents(): Promise<DomainEvent[]> {
    const res = await this.api.get<HomeEventsListResponse>(homePaths.hostEvents, {
      auth: 'bearer',
    });
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/guest-events — “Planes” (guest). */
  async getGuestEvents(): Promise<DomainEvent[]> {
    const res = await this.api.get<HomeEventsListResponse>(homePaths.guestEvents, {
      auth: 'bearer',
    });
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/banners — top slider (host/guest events, deduped; includes `no_event` fallback). */
  async getHomeBanners(): Promise<HomeBannerItem[]> {
    const res = await this.api.get<HomeBannersListResponse>(homePaths.banners, { auth: 'bearer' });
    return parseHomeBannersBody(res);
  }
}
